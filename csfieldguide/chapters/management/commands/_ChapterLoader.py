"""Custom loader for loading a topic."""

import os.path
from django.db import transaction

from utils.BaseLoader import BaseLoader
from chapters.models import Chapter


class ChapterLoader(BaseLoader):
    """Custom loader for loading chapters."""

    def __init__(self, structure_file_path, chapter_slug, BASE_PATH):
        """Create the loader for loading a topic.

        Args:
            structure_file_path (str): path to application structure file.
            chapter_slug (str): key for chapter to load.
            BASE_PATH (str): Base file path.
        """
        super().__init__(BASE_PATH)
        self.structure_file_path = structure_file_path
        self.chapter_slug = chapter_slug
        self.BASE_PATH = os.path.join(BASE_PATH, "chapters")

    @transaction.atomic
    def load(self):
        """Load the content for a chapter.

        Raise:
            MissingRequiredFieldError: when no object can be found with the matching
                attribute.
        """
        # Convert the content to HTML
        chapter_content = self.convert_md_file(
            os.path.join(
                self.BASE_PATH,
                "{}.md".format(self.chapter_slug)
            ),
            self.structure_file_path
        )

        # Create chapter object and save to the db
        chapter = Chapter(
            slug=self.chapter_slug,
            name=chapter_content.title,
            content=chapter_content.html_string,
            other_resources=None,
            icon=None
        )
        chapter.save()

        self.log("Added Chapter: {}".format(chapter.name))

        self.log("")
