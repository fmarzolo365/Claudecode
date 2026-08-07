# Home i18n / Accessibility Contract

- No hardcoded English/Spanish in renderer.
- Use current six-language T/i18n system.
- Dynamic target-language phrases preserve bidi isolation where relevant.
- Greeting must not depend on gendered grammar unless localization supplies it.
- 200% text: recommendation card may grow vertically; art must not obscure text.
- Minimum primary target 48×48 CSS px.
- Screen reader reading order:
  greeting → recommendation → journey → focus → bottom navigation.
- Progress bar has aria-valuemin/max/now and a useful accessible name.
- Decorative Marzi art has empty alt.
- Character art in recommendation should have an accessible label only if it adds information beyond adjacent text.
