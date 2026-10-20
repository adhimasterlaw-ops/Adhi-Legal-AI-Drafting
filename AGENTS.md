<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project architecture

- Keep the marketing experience as an anchored single-page route because the requested navigation maps to sections of one landing page.
- Keep shared marketing controls in `src/components/legal` so later authentication and product screens can reuse the visual system.
- Keep authenticated dashboard pages nested under the shared `/dashboard` layout so navigation, session controls, and responsive behavior stay consistent.
- Keep uploaded legal documents in private, user-scoped storage and run parsing plus AI analysis only on the server to protect confidential content.
- Keep legal drafting templates client-safe, but persist drafts, final documents, and revision versions behind authenticated owner-only server functions.
