from __future__ import annotations

from dataclasses import dataclass

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


@dataclass(slots=True)
class PreprocessOptions:
    grayscale: bool = True
    auto_rotate: bool = True
    resize_small: bool = True
    increase_contrast: bool = True
    threshold: bool = False


class ImagePreprocessor:
    def preprocess(
        self,
        image: Image.Image,
        *,
        options: PreprocessOptions | None = None,
        rotation_degrees: int = 0,
    ) -> Image.Image:
        options = options or PreprocessOptions()
        working = ImageOps.exif_transpose(image) if options.auto_rotate else image.copy()
        if rotation_degrees:
            working = working.rotate(rotation_degrees, expand=True, fillcolor="white")
        if options.grayscale:
            working = ImageOps.grayscale(working)
        if options.resize_small and min(working.size) < 1000:
            scale = min(2.5, 1000 / max(1, min(working.size)))
            working = working.resize(
                (max(1, int(working.width * scale)), max(1, int(working.height * scale))),
                Image.Resampling.LANCZOS,
            )
        if options.increase_contrast:
            working = ImageEnhance.Contrast(working).enhance(1.45)
        working = working.filter(ImageFilter.SHARPEN)
        if options.threshold:
            working = working.point(lambda pixel: 255 if pixel > 165 else 0)
        return working
