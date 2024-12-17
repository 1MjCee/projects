from django.apps import AppConfig

class SystemConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'system'
    
    def ready(self):
        import system.signals.transaction_signals
        import system.signals.rankings_signals
        import system.signals.investments_signals
        import system.signals.promocode_signals
       