from django.urls import path

from . import views

urlpatterns = [
    path(
        "generate-audio/",
        views.GenerateAudioView.as_view(),
        name="generate-audio",
    ),
]
