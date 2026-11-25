# Owner inbox

My Desk’s coffee cup opens the Owner Dashboard inbox for accounts with existing TEACH administrator access. Whipped cream indicates at least one message awaiting a reply. Returning to My Desk or refocusing it refreshes the indicator.

The inbox combines private Ask Jana threads and Contact & Help submissions. Ask Jana replies are saved to the private thread using existing Porch permissions. Contact & Help replies are submitted to Brevo from support@teachforlove.com and retained in the inbox.

## Rollout

1. Apply the owner inbox migration to the TEACH Supabase project.
2. Configure `TEACH_BREVO_API_KEY` in the TEACH Vercel project with permission to send transactional email. Use the existing verified TEACH sender.
3. In an owner session, verify the whole cup, including its handle, on desktop and mobile. In a family session, verify the cup is decorative and the inbox and send route deny access.
4. Create an Ask Jana question and a contact submission from a test family. Confirm both appear and the cream is visible. Reply to both and confirm the family receives the Porch reply and support email. Return to My Desk and confirm the cream clears when nothing else is waiting.
5. If a sending attempt has an uncertain outcome, inspect Brevo’s transactional logs before clearing the sending record or marking it sent.
