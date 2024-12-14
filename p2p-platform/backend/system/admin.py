from django.contrib import admin
from .models import User, PromoCode, InvestmentPlan, UserInvestmentPlan, Wallet, Transaction, Referral, ReferralLevel, Ranking, RankingUser, WithdrawalDetail

admin.site.register(User)
admin.site.register(PromoCode)
admin.site.register(InvestmentPlan)
admin.site.register(UserInvestmentPlan)
admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(Referral)
admin.site.register(ReferralLevel)
admin.site.register(Ranking)
admin.site.register(RankingUser)
admin.site.register(WithdrawalDetail)