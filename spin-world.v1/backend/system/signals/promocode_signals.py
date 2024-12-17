from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import PromoCode

@receiver(post_save, sender=PromoCode)
def generate_new_promo_code(sender, instance, created, **kwargs):
    """Generate enough new promo codes to bring the total unused promo codes to 40, if needed."""
    
    # Only trigger the logic when an existing promo code is marked as used
    if not created and instance.used:
        unused_codes_count = PromoCode.objects.filter(used=False).count()

        if unused_codes_count < 30:
            num_codes_to_generate = 40 - unused_codes_count

            for _ in range(num_codes_to_generate):
                PromoCode.objects.create() 

            print(f"Generated {num_codes_to_generate} new promo codes to ensure 40 unused codes.")
        else:
            print(f"Unused promo codes are {unused_codes_count}, which is sufficient. Skipping promo code generation.")
        
         # Check how many used promo codes exist
        used_codes_count = PromoCode.objects.filter(used=True).count()

        # If there are 40 or more used promo codes, delete the oldest used ones to keep the count at 40
        if used_codes_count >= 40:
            # Get the oldest used promo codes (the ones that were created first)
            promo_codes_to_delete = PromoCode.objects.filter(used=True).order_by('created_at')[:used_codes_count - 39]

            # Delete the excess used promo codes
            promo_codes_to_delete.delete()

            print(f"Removed {len(promo_codes_to_delete)} used promo codes to keep the count at 40.")
