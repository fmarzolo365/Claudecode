# MARZI PROFILE PRODUCTION V1

Prerequisite: Store approved + exact SHA supplied. Otherwise STOP.

Implement Profile root only.
No storage-key rename. No fake settings. No wardrobe catalog duplicate.

Group real current settings according to PROFILE_SETTINGS_OWNERSHIP.json.
Renderer never writes localStorage directly.

Run:
python MARZI_PROFILE_PRODUCTION_PACK_V1/tools/validate_profile_static.py public/index.html

Capture 390x844, 200%, RTL if Profile supports current locale.
Stop:
READY FOR MARZI PROFILE PRODUCTION REVIEW
