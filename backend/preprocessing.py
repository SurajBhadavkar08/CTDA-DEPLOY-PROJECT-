import re # regular expression
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

def preprocess(data):

    #  as regex is for dates, we match it to find all dates
    # (?:\s?[APap][Mm])? to optionally match AM/PM.
    # Anchor to the start of a line using '^' and enable multiline mode ... re.MULTILINE is a flag that changes how the ^ (caret) and $ (dollar) anchors behave.
    # the pattern will only match if the date is at the start of a line.
    date_regex = r'^(?:\d{1,2}/\d{1,2}/\d{1,2},\s\d{1,2}:\d{2}(?:\s?[APap][Mm])?)'
    dates = re.findall(date_regex, data, flags=re.MULTILINE)

    # user_message_regex similarly to include the optional AM/PM part, and the '-' separator after the date and time.
    user_message_regex = r'^(?:\d{1,2}/\d{1,2}/\d{1,2},\s\d{1,2}:\d{2}(?:\s?[APap][Mm])?\s-\s)'
    user_messages = re.split(user_message_regex, data, flags=re.MULTILINE)[1:]  # Skip the first empty element
    df = pd.DataFrame({'user_message':user_messages,'date':dates})
       
    # Check the first date string to decide the datetime format
    sample_date = df['date'].iloc[0].lower()
    if "am" in sample_date or "pm" in sample_date:  #If AM/PM is found, the format '%d/%m/%y, %I:%M %p' (12‑hour clock) is used.
        date_format = '%d/%m/%y, %I:%M %p'
    else:
        date_format = '%d/%m/%y, %H:%M' # else '%d/%m/%y, %H:%M' for 24‑hour clock.

    # Convert the entire 'date' column using the determined format
    df['date'] = pd.to_datetime(df['date'], format=date_format)

    # handling sensetive information
    aadhaar_regex = re.compile(r'(?<!\d)(?![01])[2-9]\d{3}\s\d{4}\s\d{4}(?!\d)')
    pan_regex = re.compile(r'(?<!\w)[A-Z]{5}[0-9]{4}[A-Z](?!\w)')

    users = []
    messages = []
    for message in df['user_message']:
        #  generalised and primitive regex used here due to variablity in contact names saved
        # Try splitting only once in case there are multiple ': ' in the message
        linesplit = re.split(r':\s', message, maxsplit=1)
        # Check if the split produced both user and message parts
        if len(linesplit) == 2:
            user, msg = linesplit
            if not (aadhaar_regex.search(msg) or pan_regex.search(msg)):
                users.append(user)
                messages.append(msg)
        else:
            users.append('System generated')
            messages.append(linesplit[0])

    df['user'] = users
    df['message'] = messages

    df.drop(columns='user_message',inplace=True)

    # further classification of date into primitives ...
    # alrady in standard format and can be coverted using inbuild fns
    df['year'] = df['date'].dt.year             # year is a property 
    df['month'] = df['date'].dt.month_name()    # month is a property, month_name is a function returning jan, feb, ...
    df['month_num'] = df['date'].dt.month
    df['day'] = df['date'].dt.day               # similar to above 
    df['only_date'] = df['date'].dt.date        # df['date'].dt.date extracts only the year-month-day part (e.g., 2024-03-04),
    df['day_name'] = df['date'].dt.day_name() 
    df['hour'] = df['date'].dt.hour
    df['minute'] = df['date'].dt.minute
    df['word_count'] = df['message'].apply(lambda x: len(x.split()))    # Create a new column with word count for each message

    period = []
    for hour in df[['day_name', 'hour']]['hour']:
        if hour == 23:
            period.append(str(hour) + "-" + str('00'))
        elif hour == 0:
            period.append(str('00') + "-" + str(hour + 1))
        else:
            period.append(str(hour) + "-" + str(hour + 1))
    df['period'] = period   # period will be used for heatmap and other projections

    df = df[df['user'] != 'System generated']   # remove system messages

    # NLP starts ...
    
    sentiments = SentimentIntensityAnalyzer()   # Object for analyzer
    
    # Creating different columns for (Positive/Negative/Neutral)
    df["po"] = [sentiments.polarity_scores(i)["pos"] for i in df["message"]] # Positive
    df["ne"] = [sentiments.polarity_scores(i)["neg"] for i in df["message"]] # Negative
    df["nu"] = [sentiments.polarity_scores(i)["neu"] for i in df["message"]] # Neutral
    
    # CATEGORISATION : To indentify true sentiment per row in message column
    def sentiment(d):
        if d["po"] >= d["ne"] and d["po"] >= d["nu"]:
            return 2    #positive
        if d["ne"] >= d["po"] and d["ne"] >= d["nu"]:
            return 0   # negative
        if d["nu"] >= d["po"] and d["nu"] >= d["ne"]:
            return 1    #neutral

    # Creating new column & Applying function
    df['value'] = df.apply(lambda row: sentiment(row), axis=1)

    user_list = df['user'].unique().tolist()    
    sorted_user_list = sorted(user_list, 
                        key=lambda x: (x.isdigit() or x.startswith("+"),
                        x.lower()))
        # custom sorting key to achieve names in ascending order, unsaved numbers at bottom
        # If x[0].isdigit() (starts with a digit) or x.startswith("+"), it's a number.
        # x.lower() ensures case-insensitive sorting for names.
    sorted_user_list.insert(0,'Overall')

    return df, sorted_user_list