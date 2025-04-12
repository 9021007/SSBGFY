# SSBGFY
 Automated timesheet data entry for SSB9

Ever since my workplace moved from SSB8 to SSB9, I have been infuriated by my timesheet, more than usual. The built-in time picker is awful, and you need to click "save" in between EVERY TIME SLOT. Seriously SSB9, GFY. 

Anyway, I have taken it upon myself to completely reimplement the timesheet system, in a way that suits me.

Click the "Click Me" button at the bottom of the timesheet screen, and a window will pop up. There is a text box for each day of the week. Simply enter your 9-5 shifts as hours separated by dashes, and you're off to the races.

Example:
- Monday: 1-2
- Tuesday: 12-1:30
- Wednesday: 1-3
- Thursday: 12-2
- Friday: 2-3, 4-5

Yep. It's that easy. No need for unnecessary minutes, colons, or even AM/PM designations. Just enter the hour and it will assume the correct time.

After clicking "Submit", the script will **TAKE TEN SECONDS** to fully submit. There will be no feedback because I am lazy and this is my own personal script.

It will apply the given schedule to the past 2 weeks, counting backwards 2 Mondays. 

The hours will save, but will NOT be submitted for review by your supervisor. Please look over the entered hours for accuracy, and then submit if they are correct.