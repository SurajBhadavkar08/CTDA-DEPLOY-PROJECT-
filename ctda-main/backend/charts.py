from wordcloud import WordCloud, STOPWORDS
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import Counter
import pandas as pd
import plotly.express as px
import io
import base64
from wordcloud import WordCloud
import numpy as np
from PIL import Image

day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

with open("stop_hinglish.txt", "r") as f:
    hinglish_stopwords = set(word.strip() for word in f.readlines())  # Remove newline characters
    custom_stopwords =  STOPWORDS.union(set([
        "Media","omitted","This","message","deleted"
    ])).union(hinglish_stopwords)

def series_to_df(sr,label_titles="titles",label_values="values"):
    df = pd.DataFrame({label_titles:sr.index, label_values:sr.values})
    return df

def top_users(df):
    x_label = "User names"
    y_label = "Message counts"

    busy_users_series = df['user'].value_counts().head()
    dfx = series_to_df(busy_users_series,x_label,y_label)

    fig = px.bar(dfx, x=x_label, y=y_label, title='Busiest Users',  text=y_label )
    fig.update_layout(
        xaxis_title="Top Users(by message counts)",
        yaxis_title="Number of messages",
    )
    return fig

def top_words(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    x_label = "Word"
    y_label = "Occourance"

    common_words = [] 
    temp = df[df['message'] != '<Media omitted>\n']
    for message in temp['message']:
        for common_word in message.lower().split():
            common_words.append(common_word)

    filtered_words = [word for word in common_words if word.lower() not in custom_stopwords]   # Remove stopwords from the list
    dfx = pd.DataFrame(Counter(filtered_words).most_common(10), columns=[x_label, y_label])

    fig = px.bar(dfx, x=x_label, y=y_label, title='Most used words',  text=y_label )
    fig.update_layout(
        xaxis_title="Most occouring words",
        yaxis_title="Number of Occourances",
    )
    return fig

def timeline(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    timeline_df = df.groupby(['year', 'month_num', 'month']).count()['message'].reset_index()
    timeline_labels = []
    for i in range(timeline_df.shape[0]):
        timeline_labels.append(timeline_df['month'][i][:3] + "-" + str(timeline_df['year'][i]))
    timeline_df['Timeline_labels'] = timeline_labels

    fig = px.line(timeline_df, x='Timeline_labels', y='message', title='Overall Timeline',  text="message" )
    fig.update_layout(
        xaxis_title="Months in year",
        yaxis_title="Number of messages (Monthly)",
    )
    return fig

def busiest_hours(df, user):
    if user != 'Overall':
        df = df[df['user'] == user]

    x_label = "Hour"
    y_label = "Message count"
    
    series = df['hour'].value_counts(sort=False)
    all_hours = pd.Series(0, index=range(24))       # Dummy series , ensuring all hours (0-23) are represented, filling missing values with 0     
    series = all_hours.add(series, fill_value=0)    # Combine the two series, ensuring all hours exist.

    dfx = series_to_df(series,x_label,y_label)

    fig = px.bar(dfx, x=x_label, y=y_label, title="Busiest hours", text=y_label)
    fig.update_layout(
        xaxis_title="Active Hours",
        yaxis_title="Number of messages (Hourly)",
    )
    return fig 

# days plotted against number of messages per day
def busiest_days(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    x_label = "Day"
    y_label = "Message count"

    day_counts_series = df['day_name'].value_counts()
    sorted_series = day_counts_series.reindex(day_order)
    dfx = series_to_df(sorted_series,x_label,y_label)

    fig_bar = px.bar(dfx, x=x_label, y=y_label, title='Busiest days (by no. of messages)',  text=y_label )
    fig_bar.update_layout(
        xaxis_title="Days in week",
        yaxis_title="Number of messages (Daily)",
    )
    fig_pie = px.pie(dfx, names=x_label, values=y_label, title="Busiest days (by no. of messages)")
    return fig_bar,fig_pie

# days plotted against number of words(content length) per day
def daily_wordcount(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    x_label = "Day"
    y_label = "Word count"

    daily_wc_series = df.groupby('day_name')['word_count'].sum()
    sorted_series = daily_wc_series.reindex(day_order)
    dfx = series_to_df(sorted_series,x_label,y_label)

    fig_bar = px.bar(dfx, x=x_label, y=y_label, title='Busiest days (by wordcount)',  text=y_label )
    fig_bar.update_layout(
        xaxis_title="Days in week",
        yaxis_title="Amount of content shared (Daily)",
    )
    fig_pie = px.pie(dfx, names=x_label, values=y_label, title='Busiest days (by wordcount)')
    return fig_bar,fig_pie

# months plotted against number of messages per month
def busiest_months(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    x_label = "Month"
    y_label = "Message count"

    month_count_series = df['month'].value_counts()
    sorted_series = month_count_series.reindex(month_order)
    dfx = series_to_df(sorted_series,x_label,y_label)

    fig_bar = px.bar(dfx, x=x_label, y=y_label, title='Busiest Months (by no. of messages)',  text=y_label )
    fig_bar.update_layout(
        xaxis_title="Months in year",
        yaxis_title="Number of messages (Monthly)",
    )
    fig_pie = px.pie(dfx, names=x_label, values=y_label, title='Busiest Months (by no. of messages)')
    return fig_bar,fig_pie

# months plotted against number of words(content length) per month
def monthy_wordcount(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]
    
    x_label = "Month"
    y_label = "Word count"

    monthly_word_count = df.groupby('month')['word_count'].sum()
    sorted_series = monthly_word_count.reindex(month_order)
    dfx = series_to_df(sorted_series,x_label,y_label)

    fig_bar = px.bar(dfx, x=x_label, y=y_label, title='Busiest Months (by wordcount)',  text=y_label )
    fig_bar.update_layout(
        xaxis_title="Months in year",
        yaxis_title="Amount of content shared (Monthly)",
    )
    fig_pie = px.pie(dfx, names=x_label, values=y_label, title='Busiest Months (by wordcount)')
    return fig_bar,fig_pie

def activity_heatmap(df, user):
    # user = 'Overall'  
    if user != 'Overall':
        df_filtered = df[df['user'] == user]
    else:
        df_filtered = df

    df_filtered['hour'] = df_filtered['hour'].astype(int)

    # Pivot table for heatmap
    user_heatmap = df_filtered.pivot_table(index='day_name', columns='period', values='message', aggfunc='count').fillna(0)

    # Ensure correct day order
    user_heatmap = user_heatmap.reindex(day_order)

    # Convert data to JSON
    heatmap_data = {
        "x": list(user_heatmap.columns),  # Periods
        "y": list(user_heatmap.index),  # Days
        "z": user_heatmap.fillna(0).values.tolist()  # Heatmap values
    }

    return heatmap_data

def wordcloud(df,user):
    if user != 'Overall':
        df = df[df['user'] == user]

    all_messages = " ".join(df['message'])

    wordcloud = WordCloud(width=800, height=400,
                        colormap = 'bone',
                        background_color="black",
                        normalize_plurals = True,
                        collocations = False,
                        stopwords = custom_stopwords).generate(all_messages)

    # ✅ Convert to NumPy array
    img_array = np.array(wordcloud)

    # ✅ Convert image to base64 (so it can be sent via JSON)
    img = Image.fromarray(img_array)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # ✅ Create Plotly Figure using an Image
    fig = px.imshow(img_array)
    fig.update_layout(title="Word Cloud", xaxis_showticklabels=False, yaxis_showticklabels=False)

    return img_str

