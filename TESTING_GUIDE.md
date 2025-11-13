# 🧪 Complete Testing Guide - Booth Dashboard App

## ✅ Testing Checklist

Use this guide to thoroughly test all features of the app.

---

## 1. 🔐 Authentication Testing

### **Login Screen**
- [ ] App loads without crashes
- [ ] Login form displays correctly
- [ ] Email field accepts input
- [ ] Password field hides characters
- [ ] "Sign In" button works
- [ ] Loading indicator shows during login
- [ ] Error messages display for invalid credentials
- [ ] Successful login navigates to dashboard

### **Logout Function**
- [ ] Logout button visible in dashboard header
- [ ] Tap logout button
- [ ] User is logged out (even with network errors)
- [ ] Returns to login screen
- [ ] **No error pop-ups** (network errors handled gracefully)
- [ ] Local session cleared successfully

**Expected Behavior:**
- Logout should work even if network fails
- Should only see: "Signing out..." → "Logout completed"
- No scary error messages shown to user

---

## 2. 🏛️ Booth Dashboard Header

### **Header Display**
- [ ] Dark purple background displays (#1E1B4B)
- [ ] Booth number badge shows "127" (or your booth)
- [ ] Booth title displays "Booth 127"
- [ ] Ward subtitle shows "Ward 15"
- [ ] Location text shows full address
- [ ] Location icon visible
- [ ] Current time updates every minute
- [ ] Agent name displays correctly
- [ ] "Active" status with green dot visible
- [ ] Logout button in top right

### **Header Interactions**
- [ ] Time updates automatically
- [ ] Logout button is tappable
- [ ] All text is readable (not cut off)
- [ ] Header doesn't scroll with content

---

## 3. 🗳️ Exit Poll Counter

### **Display**
- [ ] "Exit Poll Counter" title visible
- [ ] Total votes badge shows in header
- [ ] All 7 party cards display
- [ ] Horizontal scroll works smoothly
- [ ] Each card shows:
  - [ ] Party symbol (emoji)
  - [ ] Party short name (DMK, AIADMK, etc.)
  - [ ] Leader name
  - [ ] Vote counter (starts at 0)
  - [ ] +/- buttons
  - [ ] Colored border matching party

### **Tamil Nadu Parties Check**
- [ ] DMK - Red - 🌅 - M.K. Stalin
- [ ] AIADMK - Green - 🌿 - EPS
- [ ] BJP - Saffron - 🪷 - K. Annamalai
- [ ] TVK - Dark Red - ⚔️ - Vijay
- [ ] NTK - Gold - 🏹 - Seeman
- [ ] INC - Blue - ✋ - Congress
- [ ] NOTA - Gray - ⊘

### **Tap to Count**
- [ ] Tap DMK card → count increases to 1
- [ ] Tap again → count increases to 2
- [ ] **Haptic feedback** on each tap (phone vibrates slightly)
- [ ] Total votes updates automatically
- [ ] Percentage badge appears (e.g., "14.3%")

### **Long Press to Decrease**
- [ ] Long press DMK card → count decreases
- [ ] Cannot go below 0
- [ ] Haptic feedback on long press

### **Manual Buttons**
- [ ] Tap + button → count increases
- [ ] Tap - button → count decreases
- [ ] - button disabled when count is 0
- [ ] Haptic feedback on button taps

### **Live Calculations**
- [ ] Add votes to multiple parties
- [ ] Total updates correctly (sum of all)
- [ ] Percentages calculate accurately
- [ ] Percentages add up to ~100%

### **Reset Function**
- [ ] Tap "Reset All" button at bottom
- [ ] Confirmation dialog appears
- [ ] "Cancel" keeps counts
- [ ] "Reset" clears all to 0
- [ ] Total resets to 0
- [ ] Percentages disappear

### **Stress Test**
- [ ] Tap rapidly (20+ times) → no lag
- [ ] All parties reach 50+ votes
- [ ] Scroll through all parties smoothly
- [ ] Reset and start over → works fine

---

## 4. 📊 Voter Turnout Tracker

### **Display**
- [ ] "Voter Turnout" title visible
- [ ] 3 stat boxes show:
  - [ ] Voted count (e.g., 847)
  - [ ] Remaining count (e.g., 403)
  - [ ] Total voters (e.g., 1250)
- [ ] Percentage displays (e.g., "67.8%")
- [ ] Progress bar visible
- [ ] Progress bar fills correctly based on %

### **Color Coding**
- [ ] < 50% → Red progress bar
- [ ] 50-70% → Amber progress bar
- [ ] > 70% → Green progress bar
- [ ] Achievement badge shows at >70%

### **Quick Add Button**
- [ ] + button visible in header
- [ ] Tap + → Voted count increases by 1
- [ ] Remaining decreases by 1
- [ ] Total stays same
- [ ] Percentage recalculates
- [ ] Progress bar updates
- [ ] Color changes if crossing threshold

### **Test Scenarios**
- [ ] Start at low turnout (red)
- [ ] Increment to 50% (changes to amber)
- [ ] Increment to 70% (changes to green)
- [ ] Achievement badge appears
- [ ] Progress bar animation smooth

---

## 5. 📝 Quick Notes

### **Initial Display**
- [ ] "Quick Notes" title with icon
- [ ] Count badge shows 0
- [ ] + button visible
- [ ] Empty state shows "No notes yet"

### **Add Note Modal**
- [ ] Tap + button → Modal opens
- [ ] Modal slides up from bottom
- [ ] "Add Note" title visible
- [ ] 3 type buttons show:
  - [ ] Note (Blue icon)
  - [ ] Incident (Red icon)
  - [ ] Issue (Amber icon)
- [ ] Text input field visible
- [ ] Keyboard opens automatically

### **Creating Notes**
- [ ] Select "Note" type → Background highlights blue
- [ ] Type text → Appears in input
- [ ] "Save Note" button enabled when text entered
- [ ] Tap "Save Note" → Modal closes
- [ ] Haptic success feedback
- [ ] Note appears in list
- [ ] Timestamp shows (e.g., "12:28")
- [ ] Count badge updates to 1

### **Different Note Types**
- [ ] Create "Incident" → Red icon shows
- [ ] Create "Issue" → Amber icon shows
- [ ] Create "Note" → Blue icon shows
- [ ] Each has correct icon in list

### **Multiple Notes**
- [ ] Create 3 notes → All 3 show
- [ ] Create 4th note → "View all 4 notes" link appears
- [ ] Notes show in reverse chronological order (newest first)
- [ ] Each note shows timestamp

### **Modal Interactions**
- [ ] Tap X button → Modal closes without saving
- [ ] Tap outside modal → Modal stays open
- [ ] Save with empty text → Button disabled
- [ ] Type then delete all text → Button disabled

---

## 6. 🛠️ Data Collection Tools

### **Display**
- [ ] "Data Collection" section title
- [ ] 3 tool cards display:
  - [ ] Audio Collection (Red left border)
  - [ ] Quick Poll (Blue left border)
  - [ ] Feedback Forms (Green left border)
- [ ] Each card shows:
  - [ ] Colored icon circle
  - [ ] Title
  - [ ] Description
  - [ ] Arrow icon

### **Navigation**
- [ ] Tap "Audio Collection" → Navigates to audio screen
- [ ] Back button returns to dashboard
- [ ] Tap "Quick Poll" → Navigates to polls screen
- [ ] Back button returns to dashboard
- [ ] Tap "Feedback Forms" → Navigates to forms screen
- [ ] Back button returns to dashboard

---

## 7. 🎤 Audio Collection Screen

### **Header**
- [ ] Red gradient header
- [ ] "Audio Collection" title
- [ ] Back button works

### **Recording Interface**
- [ ] Microphone icon visible
- [ ] Duration counter shows 0:00
- [ ] "Start Recording" button displays

### **Record Audio**
- [ ] Tap "Start Recording"
- [ ] Permission dialog appears (first time)
- [ ] Grant permission
- [ ] Recording starts
- [ ] Duration counter increments (0:01, 0:02...)
- [ ] Icon changes to red recording indicator
- [ ] "Stop Recording" button replaces start

### **Stop Recording**
- [ ] Tap "Stop Recording"
- [ ] Duration counter stops
- [ ] Location permission requested (first time)
- [ ] Grant location permission
- [ ] "Location captured" message shows
- [ ] Playback controls appear:
  - [ ] Play button
  - [ ] Delete button
- [ ] Voter details form appears

### **Playback**
- [ ] Tap play button → Audio plays
- [ ] Icon changes to pause
- [ ] Tap pause → Audio stops
- [ ] Can play multiple times

### **Delete Recording**
- [ ] Tap delete button
- [ ] Recording removed
- [ ] Back to initial state
- [ ] Can record again

### **Submit**
- [ ] Fill voter name
- [ ] Fill phone (optional)
- [ ] Fill age (optional)
- [ ] Tap "Submit & Transcribe"
- [ ] Loading indicator shows
- [ ] Success message appears
- [ ] Form clears
- [ ] Can record new audio

### **Error Handling**
- [ ] Try submit without recording → Error message
- [ ] Try submit without name → Error message
- [ ] Network error → Shows error message

---

## 8. 📊 Polls Screen

### **Header**
- [ ] Blue gradient header
- [ ] "Polls & Surveys" title
- [ ] Back button works

### **Poll Selection**
- [ ] 3 poll tabs show: "Poll 1", "Poll 2", "Poll 3"
- [ ] Default poll selected (Poll 1)
- [ ] Question displays clearly
- [ ] Options list shows

### **Poll 1: Voting Intention**
- [ ] Question: "Which party will you vote for?"
- [ ] 6 options show:
  - [ ] TVK
  - [ ] DMK
  - [ ] AIADMK
  - [ ] BJP
  - [ ] Other
  - [ ] Undecided
- [ ] Radio buttons visible
- [ ] None selected initially

### **Select Option**
- [ ] Tap "TVK" → Radio fills
- [ ] Tap "DMK" → TVK unchecks, DMK checks
- [ ] Only one selectable at a time
- [ ] Card highlights when selected

### **Poll 2 & 3**
- [ ] Tap "Poll 2" tab → Switches poll
- [ ] Previous selection cleared
- [ ] New options show
- [ ] Tap "Poll 3" tab → Switches again

### **Voter Information**
- [ ] Name field visible
- [ ] Phone field (optional)
- [ ] Both accept input

### **Submit**
- [ ] Select option
- [ ] Enter name
- [ ] Tap "Submit Response"
- [ ] Loading shows
- [ ] Success message
- [ ] Form clears
- [ ] Can do another poll

### **Error Handling**
- [ ] Submit without selection → Error
- [ ] Submit without name → Error

---

## 9. 📋 Forms Screen

### **Header**
- [ ] Green gradient header
- [ ] "Forms & Messages" title
- [ ] Back button works

### **Voter Information**
- [ ] Name field (required)
- [ ] Phone field (optional)
- [ ] Age field (optional)
- [ ] All accept appropriate input

### **Issue Category**
- [ ] 8 category buttons display:
  - [ ] Employment
  - [ ] Healthcare
  - [ ] Education
  - [ ] Infrastructure
  - [ ] Corruption
  - [ ] Agriculture
  - [ ] Law & Order
  - [ ] Prices/Inflation
- [ ] Tap category → Highlights green
- [ ] Tap another → First unhighlights
- [ ] Only one selectable

### **Feedback Message**
- [ ] Large text area visible
- [ ] Placeholder text shows
- [ ] Can type multiple lines
- [ ] Text wraps properly

### **Expectations**
- [ ] Optional text area
- [ ] Accepts multiline input

### **Location**
- [ ] "Capture Location" button
- [ ] Tap button → Permission requested
- [ ] Grant permission
- [ ] "Location captured" message
- [ ] Coordinates display below button
- [ ] "Update Location" button appears

### **Submit**
- [ ] Fill name
- [ ] Type message
- [ ] Tap "Submit Feedback"
- [ ] Loading indicator
- [ ] Success message
- [ ] Form clears
- [ ] Location cleared

### **Validation**
- [ ] Submit without name → Error
- [ ] Submit without message → Error
- [ ] Can submit without category
- [ ] Can submit without phone/age
- [ ] Can submit without location

---

## 10. 📈 Today's Activity Stats

### **Display**
- [ ] "Today's Activity" title
- [ ] 4 mini stat cards
- [ ] Each shows:
  - [ ] Colored icon
  - [ ] Number value
  - [ ] Label text

### **Cards Check**
- [ ] Audio card - Red mic icon
- [ ] Polls card - Blue poll icon
- [ ] Forms card - Green description icon
- [ ] Total card - Purple people icon

### **Values**
- [ ] Numbers display (even if 0)
- [ ] No overlapping text
- [ ] Cards evenly spaced

---

## 11. 🔄 Pull to Refresh

### **Functionality**
- [ ] Pull down from top of screen
- [ ] Refresh indicator appears
- [ ] Screen refreshes
- [ ] Indicator disappears
- [ ] Data could reload (if implemented)

---

## 12. 🎨 Visual & UX Testing

### **Colors**
- [ ] Header is dark purple (#1E1B4B)
- [ ] No gradients used
- [ ] Party colors are accurate
- [ ] Text is readable on all backgrounds
- [ ] Consistent color scheme throughout

### **Typography**
- [ ] All text readable
- [ ] No text cut off
- [ ] Proper font sizes
- [ ] Good contrast

### **Spacing**
- [ ] Proper padding/margins
- [ ] Cards well spaced
- [ ] No overlapping elements
- [ ] Touch targets large enough

### **Animations**
- [ ] Smooth transitions
- [ ] Haptic feedback works
- [ ] No lag or stuttering
- [ ] Progress bar animates smoothly

### **Responsive**
- [ ] Works in portrait
- [ ] Horizontal scroll works
- [ ] Keyboard doesn't hide inputs
- [ ] Safe area respected (notch/home bar)

---

## 13. 🐛 Error Scenarios

### **Network Errors**
- [ ] Turn off WiFi
- [ ] Try to submit data → Shows error
- [ ] Turn WiFi back on
- [ ] Retry → Works

### **Permission Denials**
- [ ] Deny microphone permission
- [ ] Shows appropriate message
- [ ] Deny location permission
- [ ] Shows appropriate message
- [ ] Can still use other features

### **Invalid Input**
- [ ] Type letters in age field → Keyboard prevents
- [ ] Type letters in phone → Keyboard prevents
- [ ] Empty required fields → Validation works

---

## 14. 📱 Navigation Testing

### **Tab Bar**
- [ ] "Booth" tab selected by default
- [ ] Shows booth dashboard
- [ ] "Profile" tab works
- [ ] Can switch between tabs
- [ ] Active tab highlighted

### **Back Navigation**
- [ ] From Audio → Back → Dashboard
- [ ] From Polls → Back → Dashboard
- [ ] From Forms → Back → Dashboard
- [ ] Android back button works (if applicable)

### **Deep Navigation**
- [ ] Dashboard → Audio → Back → Dashboard → Polls → Back
- [ ] No navigation stack issues
- [ ] Always returns to correct screen

---

## 15. ⚡ Performance Testing

### **Load Times**
- [ ] App launches in <3 seconds
- [ ] Dashboard loads quickly
- [ ] Screens transition smoothly
- [ ] No freezing or hanging

### **Memory**
- [ ] Use app for 10 minutes
- [ ] No slowdown
- [ ] No crashes
- [ ] Smooth throughout

### **Battery**
- [ ] Normal battery usage
- [ ] No excessive drain

---

## 16. 🎯 User Workflow Testing

### **Morning Workflow**
1. [ ] Login
2. [ ] See booth 127 assignment
3. [ ] Check total voters (1250)
4. [ ] Exit poll counters all at 0
5. [ ] Ready to start day

### **During Day Workflow**
1. [ ] Voter exits → Tap their party
2. [ ] Increment turnout counter
3. [ ] Take notes on incidents
4. [ ] Collect audio/poll/form data
5. [ ] All works smoothly

### **End of Day**
1. [ ] Review exit poll totals
2. [ ] Check final turnout %
3. [ ] Review notes
4. [ ] Logout successfully

---

## ✅ Final Checklist

- [ ] All authentication works
- [ ] Booth header displays correctly
- [ ] Exit poll counter fully functional
- [ ] Voter turnout tracker accurate
- [ ] Quick notes feature works
- [ ] All 3 data collection screens work
- [ ] Navigation smooth
- [ ] No crashes
- [ ] No UI glitches
- [ ] Logout works (even with network errors)
- [ ] Haptic feedback works
- [ ] Performance good
- [ ] Professional appearance

---

## 🎉 Test Results

**Pass Criteria:**
- [ ] 95%+ of features working
- [ ] No critical bugs
- [ ] Logout doesn't show errors to user
- [ ] All party counters work
- [ ] Data submission successful

**If all checked:** ✅ **APP IS PRODUCTION READY!**

---

## 📝 Bug Reporting Template

If you find issues:

```
**Bug:** [Brief description]
**Screen:** [Which screen]
**Steps to Reproduce:**
1.
2.
3.
**Expected:** [What should happen]
**Actual:** [What actually happens]
**Severity:** [Critical/High/Medium/Low]
```

---

**Happy Testing!** 🧪✨
