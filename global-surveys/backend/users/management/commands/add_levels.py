from django.core.management.base import BaseCommand
from ...models import ReferralLevel, ReferralLevelBenefit

class Command(BaseCommand):
    help = 'Adds referral levels to the database'

    def handle(self, *args, **options):
        # Check if levels already exist to avoid duplicates
        if ReferralLevel.objects.exists():
            self.stdout.write(self.style.WARNING('Referral levels already exist. Use --force to replace them.'))
            if not options.get('force'):
                return
            else:
                ReferralLevel.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('Existing levels deleted.'))
        
        # Entry level
        entry = ReferralLevel.objects.create(
            name="Entry Surveyor",
            threshold=0,
            icon="🔍",
            color="bg-blue-400",
            text_color="text-blue-600",
            border_color="border-blue-400"
        )
        
        ReferralLevelBenefit.objects.create(level=entry, description="Basic survey access")
        ReferralLevelBenefit.objects.create(level=entry, description="2% bonus on referred users' earnings")
        ReferralLevelBenefit.objects.create(level=entry, description="Standard customer support")
        
        # Bronze level
        bronze = ReferralLevel.objects.create(
            name="Bronze Surveyor",
            threshold=10,
            icon="🥉",
            color="bg-amber-600",
            text_color="text-amber-600",
            border_color="border-amber-600"
        )
        
        ReferralLevelBenefit.objects.create(level=bronze, description="Access to Bronze-tier surveys")
        ReferralLevelBenefit.objects.create(level=bronze, description="5% bonus on referred users' earnings")
        ReferralLevelBenefit.objects.create(level=bronze, description="Priority customer support")
        
        # Silver level
        silver = ReferralLevel.objects.create(
            name="Silver Surveyor",
            threshold=20,
            icon="🥈",
            color="bg-gray-400",
            text_color="text-gray-500",
            border_color="border-gray-400"
        )
        
        ReferralLevelBenefit.objects.create(level=silver, description="All Bronze benefits")
        ReferralLevelBenefit.objects.create(level=silver, description="Access to Silver-tier surveys")
        ReferralLevelBenefit.objects.create(level=silver, description="10% bonus on referred users' earnings")
        ReferralLevelBenefit.objects.create(level=silver, description="Early access to new survey types")
        
        # Gold level
        gold = ReferralLevel.objects.create(
            name="Gold Surveyor",
            threshold=30,
            icon="🥇",
            color="bg-yellow-400",
            text_color="text-yellow-600",
            border_color="border-yellow-400"
        )
        
        ReferralLevelBenefit.objects.create(level=gold, description="All Silver benefits")
        ReferralLevelBenefit.objects.create(level=gold, description="Access to Gold-tier surveys")
        ReferralLevelBenefit.objects.create(level=gold, description="15% bonus on referred users' earnings")
        ReferralLevelBenefit.objects.create(level=gold, description="Monthly bonus payments")
        ReferralLevelBenefit.objects.create(level=gold, description="Exclusive industry insights")
        
        self.stdout.write(self.style.SUCCESS('Successfully added referral levels'))

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force replace existing levels',
        )