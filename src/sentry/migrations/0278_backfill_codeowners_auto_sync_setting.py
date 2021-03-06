# Generated by Django 2.2.24 on 2022-03-07 20:05

from django.db import migrations

from sentry.new_migrations.migrations import CheckedMigration
from sentry.utils.query import RangeQuerySetWrapperWithProgressBar


def backfill_codeowners_auto_sync_column(apps, schema_editor):
    ProjectOwnership = apps.get_model("sentry", "ProjectOwnership")

    for ownership in RangeQuerySetWrapperWithProgressBar(ProjectOwnership.objects.all()):
        if ownership.codeowners_auto_sync is None:
            ownership.codeowners_auto_sync = True

        ownership.save()


class Migration(CheckedMigration):
    # This flag is used to mark that a migration shouldn't be automatically run in production. For
    # the most part, this should only be used for operations where it's safe to run the migration
    # after your code has deployed. So this should not be used for most operations that alter the
    # schema of a table.
    # Here are some things that make sense to mark as dangerous:
    # - Large data migrations. Typically we want these to be run manually by ops so that they can
    #   be monitored and not block the deploy for a long period of time while they run.
    # - Adding indexes to large tables. Since this can take a long time, we'd generally prefer to
    #   have ops run this and not block the deploy. Note that while adding an index is a schema
    #   change, it's completely safe to run the operation after the code has deployed.
    is_dangerous = False

    # This flag is used to decide whether to run this migration in a transaction or not. Generally
    # we don't want to run in a transaction here, since for long running operations like data
    # back-fills this results in us locking an increasing number of rows until we finally commit.
    atomic = False

    dependencies = [
        ("sentry", "0277_backfill_dashboard_widget_query_columns_aggregates"),
    ]

    operations = [
        migrations.RunPython(
            backfill_codeowners_auto_sync_column,
            migrations.RunPython.noop,
            hints={"tables": ["sentry_projectownership"]},
        )
    ]
