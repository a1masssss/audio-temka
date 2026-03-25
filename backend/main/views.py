import mimetypes
import os

from django.conf import settings
from django.http import HttpResponse
from dotenv import load_dotenv
from google import genai
from google.genai import types
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

load_dotenv(settings.BASE_DIR / ".env")


class GenerateAudioSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        help_text="Text description of the audio to generate.",
    )


class GenerateAudioView(APIView):
    @extend_schema(
        request=GenerateAudioSerializer,
        responses={200: OpenApiTypes.BINARY},
        summary="Generate audio from a text prompt",
    )
    def post(self, request):
        prompt = request.data.get("prompt")
        if prompt is None or not str(prompt).strip():
            return Response(
                {"detail": "Field 'prompt' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return Response(
                {"detail": "GEMINI_API_KEY is not set."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        client = genai.Client(api_key=api_key)
        model = "lyria-3-pro-preview"
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=str(prompt))],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_modalities=["audio"],
        )

        audio_parts: list[bytes] = []
        mime_type = "audio/wav"

        try:
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if chunk.parts is None:
                    continue
                part = chunk.parts[0]
                if part.inline_data and part.inline_data.data:
                    if part.inline_data.mime_type:
                        mime_type = part.inline_data.mime_type
                    audio_parts.append(part.inline_data.data)
        except Exception as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if not audio_parts:
            return Response(
                {"detail": "No audio returned from the model."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        body = b"".join(audio_parts)
        ext = mimetypes.guess_extension(mime_type) or ".wav"
        filename = f"generated{ext}"
        response = HttpResponse(body, content_type=mime_type)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
