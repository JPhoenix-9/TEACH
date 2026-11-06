# TEACH TRANSCRIPT ARCHITECT
## Master Product Specification
Updated October 1, 2026

Price correction confirmed November 5, 2026: $79 per student; section 51 corrected to match section 3. All 56 specification sections retained below.

## 1. CORE PRODUCT PURPOSE
The TEACH Homeschool Transcript Generator helps a homeschooling parent turn the education their student actually completed into a polished, professional, accurate high-school transcript.
The parent should NOT need to understand transcript conventions before beginning.
The application should help the parent:
- Remember and identify coursework.
- Recognize legitimate high-school-level learning that may not have looked like a conventional class.
- Organize coursework appropriately.
- Create professional course titles.
- Determine defensible credit amounts when necessary.
- Create accurate course descriptions.
- Calculate credits and GPA.
- Produce a professional transcript.
- Compare that transcript with the published requirements of particular colleges or universities.
- Adapt the presentation of the transcript when appropriate without changing the underlying academic facts.

The governing principle is:
We translate a real homeschool education into the language of a professional academic record—without inventing anything.
The app advises. The parent decides.

## 2. DESIRED CUSTOMER EXPERIENCE
The application must feel calm, friendly, reassuring, competent, and manageable from beginning to end.
The target customer may arrive thinking:
“I have no idea how to make a transcript.”
“I didn’t keep perfect records.”
“I don’t know what counts.”
“I’ve put this off because I dread doing it.”

The desired reaction after using the product is:
“I dreaded doing my child’s transcript, but this made it so much easier than I ever dreamed it could be.”
That reaction is a usability standard for the product.
The application should:
- Ask one manageable thing at a time.
- Avoid walls of questions and long forms whenever possible.
- Use ordinary parent language.
- Explain unfamiliar academic terminology only when necessary.
- Avoid making the parent repeat information.
- Collect related information in batches whenever practical.
- Reassure parents that information can be corrected.
- Avoid unnecessary warning symbols and alarming language.
- Treat unconventional homeschool education respectfully.
- Make genuine problems specific, calm, and actionable.
- Use AI interviews only where conversation and judgment actually add value.
- Use ordinary deterministic software for routine data collection and calculations.
- Give the parent small feelings of progress throughout the process.

Routine information should feel like simple data entry.
Complex or unconventional education should feel like a helpful conversation.

## 3. BUSINESS MODEL
Target price:
Approximately $79 per student.
One purchase applies to ONE student.
The project remains active for:
Three years from purchase.
During those three years, the parent may:
- Reopen the student’s project.
- Update coursework.
- Correct information.
- Regenerate transcripts.
- Perform school-specific transcript checks.

Multiple children require separate purchases.
The purchase is associated with the student rather than merely with the parent.

## 4. COLLEGE COMPATIBILITY CHECK LIMIT
Each student/project includes checks for up to:
12 unique colleges or universities during the three-year period.
Rechecking the SAME institution does not consume another unique-school slot.
Examples:
University A checked three times = one unique school.
University A + University B + University C = three unique schools.
The interface should display usage clearly, for example:
College Compatibility Checks: 4 of 12 used
A failed search, misspelling, mistaken school selection, or technical error should NOT consume a school.
The app should verify the institution before permanently counting it.

## 5. PRIVACY AND PROJECT STORAGE
File-based saving clarification — November 5, 2026 (supersedes the earlier browser-autosave clarification):
Before the parent begins entering the student record, show a save setup dialog to choose a project filename and storage location. The editable .teach-transcript.json file is the working copy. Show its name prominently beside Save Now and Save As. Where the browser grants direct file access, automatic saving at edits/transitions and Save Now update the same selected file, with success reported only after the write is committed. In browsers requiring system save dialogs, Save Now opens the device share/save flow or download; explain Save to Files, selecting the same name/folder, and Replace when offered. Prompt again at workflow transitions with unsaved changes, and ask the parent to confirm completion when the app cannot verify the device’s save. Never label a cancelled or failed save as completed. Include unfinished answers, proposals, course-title drafts and the workflow position in the project file so reopening restores the work. Do not write new complete academic records to browser storage or the server. Preserve earlier browser copies as a read-only recovery route until parents move them into project files. Reopening a project uses the saved file and the account associated with that student purchase.

Whenever technically practical, avoid requiring a traditional account.
The application should not permanently retain the student’s complete academic record on the server.
Instead, the parent receives an editable Transcript Project File.
Returning users should see choices such as:
Create a New Transcript
Continue a Saved Transcript
The parent must be clearly told that the project file is important.
Example:
Save Your Transcript Project File
You’ll need this file when you return to update your student’s transcript. We don’t keep a copy of the complete academic record, so keep this file somewhere safe.
Recommend keeping two copies in different safe locations without requiring or prescribing a particular cloud service.
Instructions for downloading, saving, locating, and re-uploading the project file must be extremely clear for nontechnical users.

## 6. STUDENT PROJECT IDENTIFICATION
At setup, collect the student’s full name.
Generate an internal random:
Transcript Project ID
Do NOT use Social Security numbers or other government identifiers as project IDs.
Allow legitimate student name corrections and later name changes.

## 7. INITIAL STUDENT SETUP
Use friendly terminology such as:
Set Up Student Record
rather than unnecessarily technical/account-oriented terminology.
Collect:
- Student’s full name.
- Currently enrolled or graduated.
- Expected graduation date or actual graduation date.
- School name.
- Administrator name/title.
- Necessary school contact information.

The application should support both:
- In-progress transcripts.
- Final/graduated transcripts.

## 8. HOMESCHOOL NAME
The parent may already have a homeschool/school name.
If not, the application can help create a professional name such as:
Smith Academy
The application may offer AI assistance with naming.
It must not imply accreditation, legal status, or institutional characteristics that do not exist.

## 9. ADMINISTRATOR TITLE
Provide options such as:
- Administrator
- Principal
- Head of School
- Academic Administrator
- Director
- Other

If Other is selected, allow a custom title.
The transcript should identify the parent appropriately in an administrative role rather than using informal terminology such as “Homeschool Mom.”

## 10. PRE-COURSEWORK ORIENTATION
Immediately before beginning coursework entry, show a brief notice explaining that high-school-level work completed before ninth grade may sometimes belong on the high-school transcript.
Suggested language:
Before we start, one important thing:
Don’t leave out a course or substantial learning experience simply because your student completed it before ninth grade. High-school-level work may sometimes belong on a high-school transcript even when it was completed earlier.
Enter what your student actually completed, and we’ll help you sort out what belongs in the final record.
You don’t have to figure that out before you begin. If you’re unsure about something, include it. We’ll review it with you.
The principle is:
Completed before ninth grade does not automatically mean excluded.
However:
Work completed before ninth grade does not automatically qualify either.
Its level and substance matter.

## 11. TRANSCRIPT ORGANIZATION
The preferred transcript organization is:
SUBJECT-AREA FORMAT
rather than strictly year-by-year.
This accommodates homeschool students who may complete high-school-level coursework earlier than conventional grade sequencing.
However, the underlying record must still retain the academic year/grade level in which each course was completed.
That information may be required by colleges, NCAA, or other institutions and may need to appear in particular transcript presentations.

## 12. REGULAR COURSEWORK SEQUENCE
Collect ordinary coursework categorically in this order:
1. English / Language Arts
2. Mathematics
3. Science
4. History / Social Studies
5. Foreign Languages
6. Technology
7. Fine Arts
8. Physical Education
9. Electives

Electives is handled differently and receives a deeper discovery interview.

## 13. ROUTINE COURSE ENTRY EXPERIENCE
Do NOT interview the parent course-by-course when routine categorical entry will suffice.
For example:
Let’s start with English.
Enter the names of Johnny’s English classes. Don’t worry if the titles aren’t perfect—we’ll review them later.
The parent might type:
English I, English II, American Literature, British Literature
The application parses those into rows and presents an editable grid.
Example:

| Course Title | Credit | Grade | Year |
| --- | --- | --- | --- |
| English I | 1.0 | A | 9 |
| English II | 1.0 | B | 10 |
| American Literature | 1.0 | A | 11 |
| British Literature | 1.0 | A | 12 |

EVERYTHING IN THE GRID IS EDITABLE.
That includes:
- Course title.
- Credit amount.
- Grade.
- Academic year/grade level.

Provide:
+ Add Another Course
and an easy way to remove a mistaken row.
Where conventional information can reasonably be suggested, the app may prepopulate it, but the parent must be able to change it.
The governing rule is:
System-generated defaults are conveniences, never locked academic facts.

## 14. MINIMUM NECESSARY QUESTIONS
Never ask the parent something the system already knows.
Never make the parent answer four questions when one grouped question and a confirmation will accomplish the same thing.
Recognizable sequences may be suggested or prepopulated, but academic facts must ultimately be confirmed by the parent.
Example:
English I
English II
English III
English IV
should not require four independent interviews.

## 15. BLANK CATEGORIES TRIGGER DISCOVERY
A parent saying “none” does not necessarily mean the student had no learning in that subject.
It may mean:
“We didn’t call it a class.”
Therefore:
A blank category triggers discovery, not an assumption of deficiency.
The app should use brief follow-up questions where appropriate to make sure substantial learning was not overlooked.
This is particularly important for:
- Foreign language.
- Technology.
- Fine Arts.
- Physical Education.

It may also be useful in other major academic areas when the record appears unusually empty.

## 16. FINE ARTS DISCOVERY
Fine Arts is a normal coursework category, NOT merely an elective catch-all.
It may include:
- Visual art.
- Drawing.
- Painting.
- Photography.
- Music.
- Choir.
- Community chorus.
- Church music.
- Band.
- Orchestra.
- Instrumental music.
- Music theory.
- Theater/drama.
- Community theater.
- Dance.
- Other legitimate fine-arts study.

If the parent initially reports no Fine Arts coursework, specifically ask about both instruction and participation.
PRIVATE LESSONS MUST BE EXPLICITLY ASKED ABOUT.
Examples:
- Piano lessons.
- Guitar lessons.
- Violin or other instrumental lessons.
- Private voice/singing lessons.
- Group music instruction.
- Art lessons.
- Dance instruction.
- Acting instruction.

Do not bury private instruction in a generic example list.
When substantial activity is identified, interview the parent about:
- Length of participation.
- Frequency.
- Formal instruction.
- Practice.
- Skill progression.
- Repertoire.
- Performances.
- Recitals.
- Productions.
- Theory or academic content where relevant.
- Other evidence of substantial study.

The app can then determine whether a defensible high-school course exists.

## 17. PHYSICAL EDUCATION DISCOVERY
Physical Education is also a regular category.
If the parent reports no formal PE class, ask about substantial physical activity such as:
- Upward sports.
- Recreation leagues.
- School/community teams.
- Martial arts.
- Dance.
- Swimming.
- Running.
- Fitness training.
- Equestrian activities.
- Other organized or sustained physical activity.

Participation does not automatically equal academic credit.
It opens an interview to determine whether the activity can reasonably support PE credit.

## 18. TECHNOLOGY DISCOVERY
If the parent reports no formal technology classes, ask about substantial experience such as:
- Coding.
- Web design.
- CAD.
- Computer building/repair.
- Robotics.
- Video production/editing.
- Digital design.
- Livestream or production technology.
- Other sustained technical work.

Again, activity is not automatically converted into credit.
The app investigates first.

## 19. ELECTIVES — FULL DISCOVERY INTERVIEW
Electives is where the application changes from quick categorical data entry to a deeper AI-assisted interview.
Do NOT begin by asking:
“What electives did Johnny take?”
Many homeschool parents will not recognize substantial learning as transcript-worthy coursework.
Instead explain:
Now let’s look for the learning that’s easier to overlook.
Homeschool students often learn a great deal outside courses with obvious names. I’m going to ask you about your student’s activities, interests, projects, work, and other experiences.
Don’t worry about deciding whether something “counts.” Tell me what your student actually did, and I’ll help you sort through it.
Explore areas such as:
- Employment.
- Family business.
- Entrepreneurship.
- Agriculture/farm work.
- Mechanical work.
- Construction/building.
- Coding/technology.
- Music.
- Art.
- Theater.
- Ministry/service.
- Apprenticeships.
- Intensive hobbies.
- Independent study.
- Major reading/research.
- Practical skills.
- Long-term projects.
- Other substantial learning experiences.

## 20. ELECTIVE QUALIFICATION
When unconventional learning is identified, classify it internally as:
QUALIFIES
MAY QUALIFY — MORE INFORMATION NEEDED
DOES NOT QUALIFY
The app is explicitly allowed to conclude that an experience should NOT be represented as academic credit.
It should explain that gently and briefly.
The product must never become an “AI credit vending machine.”

## 21. ELECTIVE COURSE CREATION WORKFLOW
For each potentially legitimate unconventional course:
Discover → Interview → Evaluate → Name → Describe → Suggest Credit → Parent Approves/Edits
Do this while the relevant information is fresh.
Do NOT collect all experiences first and force the parent to reconstruct them later.
Example:
A student spent substantial time repairing tractors with a grandfather.
Interview about:
- Duration.
- Frequency.
- Instruction.
- Types of repairs.
- Maintenance.
- Diagnostics.
- Engines.
- Electrical systems.
- Tool use.
- Safety.
- Manuals.
- Increasing independence.
- Demonstrated skills.

If appropriate, the app might suggest:
Small Engine & Agricultural Equipment Maintenance
Then generate an accurate description based only on facts supplied.
The parent may edit:
- Title.
- Description.
- Credit.

After the entire elective-discovery interview is complete, present an editable Electives Grid and collect grades.

## 22. COURSE DESCRIPTIONS
Create descriptions while unusual/nontraditional courses are being developed.
Do not postpone them until the end.
Descriptions must be based strictly on information supplied by the parent.
No embellishment.
Example:
Agricultural Science and Farm Management — 1.0 Credit
An applied study of agricultural systems incorporating livestock management, crop production, equipment operation and maintenance, farm safety, and basic agricultural business practices. Coursework included supervised practical application of concepts in an operating farm environment.
Early in the process, allow the parent to choose:
Create descriptions for all courses
or
Create descriptions only for app-created/nontraditional courses
This preference may be changed later.
If a particular college requires additional descriptions, the app can gather the necessary factual information later.

## 23. COURSE TITLE REVIEW
The app should review ALL course titles and offer more conventional/professional wording where useful.
Example:
Original:
English
Possible suggestion:
English Literature and Composition
Only suggest a title if the parent’s description supports it.
Show:
- Original title.
- Suggested title.
- Brief reason.
- Use Suggested Title.
- Keep My Title.
- Edit.

The parent always has final control.

## 24. CREDIT DETERMINATION
Unlike grades, the application MAY help determine appropriate credit.
When necessary, interview the parent about:
- Duration.
- Frequency.
- Approximate hours.
- Materials.
- Scope.
- Instruction.
- Projects.
- Labs.
- Completed work.
- Demonstrated mastery.
- Skill progression.

Then suggest a defensible credit amount such as:
0.5 credit
1.0 credit
Do not mechanically apply a single hours formula to every course.
Consider:
- Time.
- Scope.
- Substance.
- Completed work.
- Demonstrated learning/mastery.

The parent makes the final decision.
Suggested-credit notice:
This is a suggested credit value based on the information you provided. The parent/administrator is responsible for the final academic record, and receiving institutions determine whether and how they accept homeschool credit.

## 25. GRADES
The application NEVER assigns a student’s grade.
The parent supplies the grade.
Accept:
- Letter grades.
- Plus/minus grades.
- Satisfactory Completion.

Do not require exact numerical percentages when the parent did not use them.

## 26. DEFAULT GRADING SCALE
Default to the conventional 10-point scale:
A = 90–100
B = 80–89
C = 70–79
D = 60–69
F = below 60
Allow the parent to enter a different grading scale if that is what the homeschool actually used.
Support plus/minus grades.
The transcript should identify the grading/GPA scale being used.

## 27. SATISFACTORY COMPLETION
Allow:
Satisfactory Completion (SC)
for legitimate completed coursework that was not assigned a conventional letter grade.
SC may earn credit.
SC does not contribute conventional grade points to GPA.
The app should explain this to the parent.

## 28. IN-PROGRESS COURSES
Allow:
IP — In Progress
An in-progress course:
- May appear on an in-progress transcript.
- Has no final grade yet.
- Does not contribute to GPA until completed.

## 29. FAILED/ATTEMPTED COURSEWORK
Do NOT establish a universal rule that failed coursework should simply be omitted.
Requirements vary among institutions and organizations.
The app should never coach a parent to conceal academic history.
School-specific requirements may determine how attempted/failed coursework should be presented.

## 30. GPA
The app calculates GPA.
Allow:
Standard / Unweighted GPA
and
Weighted GPA
for legitimate qualifying advanced coursework.
Retain enough underlying information to calculate an unweighted GPA even when a weighted GPA is displayed.
Do not assume every institution uses the same weighting system.

## 31. ADVANCED COURSE DESIGNATIONS
Honors
A parent may identify legitimate honors-level coursework.
The app may ask enough questions to ensure the designation is intentional and supportable.
AP
Do NOT casually label a course “AP.”
AP designation should be used only where appropriate under College Board AP Course Audit rules.
If a course is advanced but not properly designated AP, help the parent choose an accurate alternative such as:
Advanced Biology
if supported by the coursework.
Dual Enrollment
Collect where relevant:
- College/institution.
- College course title.
- Course number if known.
- Grade.
- High-school credit.

Remind the parent when an official college transcript may need to be submitted separately.

## 32. TRANSCRIPT GENERATION AFTER INITIAL ENTRY
When the parent believes all relevant academic information has been entered, do NOT send her through another giant administrative review process.
Say something like:
Great. I’m generating your transcript now.
Generate the actual polished transcript.
The parent reviews the transcript itself.
Provide:
Make Changes
and
Final Approval
The transcript generated at this stage is a REAL, complete transcript.
Do NOT call it:
“Basic Transcript”
“Preliminary Transcript”
or anything else that makes it sound inferior.
Parent-facing terminology should simply be:
Transcript
This transcript may be usable for most receiving institutions without any additional school-specific adaptation.

## 33. FINAL CERTIFICATION
Before final generation/download, require the parent/administrator to acknowledge:
I certify that, to the best of my knowledge, the information contained in this transcript is complete and accurate and truthfully represents this student’s academic record.
Do not create an artificial “official vs unofficial” distinction merely because the document is generated electronically.
The meaningful distinction is:
- Editable/review stage.
- Parent-certified final transcript.

## 34. TRANSCRIPT APPEARANCE
The final transcript should look like a professional transcript from an established small private school.
Design characteristics:
- Restrained typography.
- Clean spacing.
- Clear hierarchy.
- Professional subject divisions.
- Credits easy to locate.
- GPA easy to locate.
- School identity prominent.
- Student information clear.
- Graduation information clear.
- Grading/GPA scale included.
- Administrator/signature area.
- No “cute homeschool” aesthetic.

Desired reader reaction:
“This is a transcript.”
Not:
“Someone made a homeschool transcript.”

## 35. DOWNLOAD AND SAVE COACHING
After generation, explicitly coach the parent to save the files.
Make the distinction between documents obvious.
Possible downloads:
Download Transcript PDF
Download Course Description Addendum
Download Editable Transcript Project File
Explain that the PDF is the transcript and the project file is what allows future editing.
Recommend keeping backup copies.

## 36. COLLEGE COMPATIBILITY CHECK — PARENT INVITATION
After the parent has generated the normal transcript, ask:
Would you like me to check this transcript against a specific college or university’s published requirements?
Explain:
I can review the school’s current published requirements, compare them with the information you’ve entered, and help make sure your transcript includes the information that school expects.
Options:
Yes — Check a School
No — I’m Finished for Now
Avoid the word “audit” in ordinary parent-facing language because it sounds unnecessarily intimidating.

## 37. SCHOOL IDENTIFICATION
If the parent chooses a school check:
Ask for the institution.
Verify the exact institution before proceeding.
Avoid confusion such as:
Miami University
vs.
University of Miami
The parent confirms the intended school.

## 38. SCHOOL RESEARCH SOURCES
Use current authoritative sources only:
- Official admissions website.
- Official homeschool-applicant instructions.
- Official catalog.
- Registrar/transcript instructions.
- Other official institutional materials.

Do not consult random blogs, forums, or outdated third-party admissions advice for requirements.
Record the date the requirements were checked.

## 39. PURPOSE OF SCHOOL-SPECIFIC CHECK
The primary purpose is:
Determine whether the transcript’s presentation and documentation match what the selected institution requests from homeschool applicants.
Secondary purpose:
Identify published academic-preparation requirements that may deserve the parent’s attention.
This is NOT an admissions prediction service.
The application must never promise:
- Admission.
- Scholarship eligibility.
- Acceptance of particular credits.
- NCAA eligibility.
- Transfer-credit acceptance.

## 40. SCHOOL CHECK ARCHITECTURE
For each school:
Research School → Compare Transcript → Identify Mismatches → Determine Whether Existing Information Solves Them → Interview Parent if Necessary → Update Factual Record → Recheck → Generate Appropriate Transcript
There are three primary outcomes.
Outcome A — Already Meets Requirements
Tell the parent that the transcript appears to contain the information requested in the school’s published requirements.
Make any useful presentation adjustments.
Outcome B — Missing Presentation/Documentation, but Information Exists
Example:
The school wants academic years displayed.
The system already has the years internally.
Simply include them.
If descriptions or other information can accurately be generated from existing facts, do so.
Outcome C — Requirement Cannot Currently Be Satisfied
Interview the parent to determine whether the missing factual information exists.
If the parent can supply it:
Add the new truthful information to the student’s underlying academic record.
If the parent cannot supply it:
DO NOT INVENT IT.
Offer:
Generate Best-Match Transcript
This produces the closest truthful match to the school’s requirements.

## 41. SCHOOL-SPECIFIC TRANSCRIPT VERSIONS
Internally, maintain one authoritative factual academic record.
Parent-facing language does NOT need to call this a “master academic record.”
The parent should understand that her normal transcript is a genuine transcript.
School-specific versions may be generated from the same factual record.
Examples:
Transcript
Transcript — University of Kentucky
Transcript — Western Kentucky University
These are not competing academic histories.
They are different presentations of the same truthful academic record.
A school-specific version may:
- Reorganize information.
- Display information previously stored but not shown.
- Add factual information gathered during a follow-up interview.
- Include additional descriptions/documentation.
- Adjust presentation to the school’s published preferences.

It may NOT:
- Invent coursework.
- Invent grades.
- Invent credits.
- Change facts merely to satisfy a school.
- Misrepresent the student’s education.

## 42. BEST-MATCH TRANSCRIPT
If a school requests something that cannot truthfully be supplied, explain calmly:
I’ve taken this as far as the information available allows.
Explain what the school requests and what information remains unavailable.
Then explain:
I can still prepare the transcript to match this school’s requirements as closely as possible without adding or changing information that isn’t supported by your student’s actual academic record.
Offer:
Generate Best-Match Transcript
Do NOT use language such as:
“Generate Anyway”
which implies wrongdoing or recklessness.
Use every legitimate improvement possible even if one requirement remains unresolved.

## 43. A MISMATCH IS NOT AN ADMISSIONS VERDICT
This is a major product rule.
A transcript mismatch is presented as an issue to investigate or address—not as an admissions verdict.
The application must distinguish:
“The school publishes this requirement.”
from:
“Your transcript does not currently document this.”
from:
“Your student cannot be admitted.”
The app may establish the first two.
It should NOT independently conclude the third.
When a shortfall exists, explain that a perfect match does not necessarily determine admission.
A college may:
- Consider other parts of the application.
- Allow alternative documentation.
- Permit another way to satisfy a requirement.
- Require coursework before enrollment.
- Require coursework after enrollment.
- Exercise other institutional discretion.

The app should encourage the parent to investigate the specific issue.
Example:
There’s one item to be aware of.
[University] lists two years of foreign-language study among its published preparation requirements. Johnny’s record currently shows one year.
That does not necessarily mean Johnny cannot be admitted.
The university may have alternative ways of addressing the requirement. I can’t change Johnny’s record to show coursework he didn’t complete, but I can prepare the closest accurate transcript and help you identify what to ask the university.

## 44. HELP THE PARENT ASK THE SCHOOL
When useful, offer:
Show Me What to Ask the School
Generate a concise question the parent can take to admissions.
Example:
“My homeschooled student completed one year of high-school foreign language rather than the two years listed in your admissions requirements. Are there alternative ways to satisfy this requirement, or can it be completed after enrollment?”
The purpose is to turn uncertainty into an actionable next step.

## 45. SCHOOL REQUIREMENTS REPORT
For every College Compatibility Check, allow the parent to:
Save/Print This School’s Requirements
Generate a clean dated report containing:
- Institution name.
- Date researched.
- Relevant published transcript/documentation requirements.
- Homeschool-specific requirements found.
- Academic-preparation requirements relevant to the comparison.
- Official sources consulted.
- Comparison notes.
- Items already satisfied.
- Items requiring attention.
- Any unresolved items.
- Suggested questions for admissions when appropriate.

This report is NOT another transcript.
It is a reference document for the parent’s records.
If the same school is rechecked later, generate a new current report.
The same school still counts as only one of the 12 unique schools.

## 46. SCHOOL-CHECK DISCLAIMER
When the parent first uses College Compatibility Check, provide a clear contextual disclaimer and obtain acknowledgment.
On individual school results, include a shorter reminder such as:
This review compares your student’s record with this institution’s published requirements as of [date]. It does not guarantee admission or acceptance of coursework. Confirm current requirements with the institution before submitting an application.
Do not bury the application in legalistic warnings.
Use disclaimers where reliance actually matters.

## 47. AFTER SCHOOL-SPECIFIC REVIEW
After all identified issues have been addressed as far as possible, ask:
Is there anything else you’d like to add or correct before I prepare this version?
If no:
Okay. I’m generating your updated transcript for [School Name].
Generate the school-specific transcript.
Allow review and approval.
Then coach the parent to download/save:
- School-specific transcript.
- Updated project file.
- School Requirements Report.
- Course Description Addendum if applicable.

Then ask:
Would you like to check your student’s transcript against another school?
Options:
Check Another School
I’m Finished for Now
Repeat up to the 12-unique-school limit.

## 48. NCAA
Early in setup ask:
Is this student considering NCAA Division I or Division II athletics?
Options:
Yes
No
Not Sure
If Yes or Not Sure, explain that NCAA homeschool eligibility may require documentation beyond the normal transcript.
The app should identify relevant current documentation requirements and direct the parent to the NCAA Eligibility Center where necessary.
Do not imply that the transcript generator assumes responsibility for every NCAA eligibility document or determination.

## 49. COLLEGE-READINESS WARNINGS
The application may identify potential academic-preparation issues, but warnings should be calm and non-deterministic.
Example:
“Many colleges expect or recommend world-language study. Requirements vary, so check the institutions your student is considering.”
Never imply:
“Your child can’t go to college because this course is missing.”
The school-specific check exists precisely because requirements vary.

## 50. GRADE-INTEGRITY GUIDANCE
Use gentle language encouraging defensible grades.
Suggested wording:
Assign grades you can defend. Your student’s transcript should accurately represent the quality of work completed. Colleges may consider grades alongside course rigor, outside coursework, standardized testing when submitted, and other academic evidence. Keep sufficient records to support grades when necessary.
Do not claim that a particular standardized-test score automatically validates or invalidates homeschool grades.

## 51. AI VS. ORDINARY CODE
Use ordinary deterministic code wherever judgment is unnecessary.
Examples:
- Forms.
- Navigation.
- Required-field validation.
- Credit totals.
- GPA calculations.
- Weighted/unweighted calculations.
- Dates.
- Subject organization.
- Project files.
- Transcript layout.
- PDF generation.
- Three-year project period.
- Project identification.
- School-check usage counter.

Use AI only where language, judgment, discovery, or current research genuinely adds value.
Examples:
- Course-title polishing.
- Nontraditional-learning interviews.
- Determining whether an experience plausibly supports academic credit.
- Suggested credit amounts.
- Course classification.
- Course descriptions.
- Identifying possible omissions.
- Discovering overlooked learning.
- Academic-language cleanup.
- College Compatibility research and comparison.
- Generating questions for admissions.

Goal:
Keep AI/API usage small and predictable relative to the approximately $79 purchase price.

## 52. DATA-INTEGRITY RULE
The school-check engine may:
- Identify a gap.
- Investigate a gap.
- Ask about a gap.
- Help document facts that resolve a gap.

It may NEVER:
Fill a gap with an unsupported assumption.
Likewise, the broader application may:
- Discover.
- Organize.
- Suggest.
- Explain.
- Polish.
- Calculate.
- Format.

It may not fabricate.

## 53. PARENT CONTROL RULE
Any information presented back to the parent for inclusion in the academic record must remain editable before final approval.
AI suggestions and system defaults are never locked values.
The parent is the administrator responsible for the academic record.
The app assists the parent; it does not replace the parent’s authority.

## 54. EMOTIONAL DESIGN RULE FOR PROBLEMS
Even when a genuine issue is discovered, the parent should leave the interaction thinking:
“Okay. I understand the issue and I know what I can do next.”
Not:
“We’ve ruined my child’s future.”
Warnings should therefore be:
- Specific.
- Accurate.
- Calm.
- Actionable.
- Proportionate.

Never catastrophize.

## 55. CORE PRODUCT WORKFLOW
The complete experience should approximately follow this rhythm:
Purchase
→ Student Setup
→ School Identity
→ Pre-Coursework Orientation
→ English
→ Math
→ Science
→ History/Social Studies
→ Foreign Languages
→ Technology
→ Fine Arts
→ Physical Education
→ Elective Discovery Interview
→ Course Naming/Descriptions/Credit Determination as Needed
→ Grades/GPA
→ Generate Transcript
→ Parent Reviews Transcript
→ Final Certification/Approval
→ Download Transcript + Project File + Addendum if applicable
→ Ask Whether Parent Wants a College Compatibility Check
→ Identify School
→ Research Current Official Requirements
→ Compare Transcript
→ Coach Parent Through Issues One at a Time
→ Interview for Additional Factual Information Where Necessary
→ Update Academic Record
→ Recheck
→ If Fully Matchable, Generate School-Specific Transcript
OR
→ If Not Fully Matchable, Explain Remaining Issue and Generate Best-Match Transcript
→ Generate/Print School Requirements Report
→ Download and Save Updated Files
→ Ask Whether Parent Wants to Check Another School
→ Repeat as desired within 12-school limit.

## 56. PRODUCT PROMISE
The product is NOT merely selling PDF formatting.
Its value is:
Bring us the education your child actually completed—even if your records are messy or your homeschool didn’t look like a conventional high school. We’ll guide you through turning it into a polished, accurate, professional academic record.
The application should leave the parent feeling that making a homeschool transcript was dramatically easier than expected.
Above all:
Make it easy. Make it truthful. Make it professional. Don’t make Mom afraid of it.
