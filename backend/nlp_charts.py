import matplotlib.pyplot as plt
import pandas as pd
from collections import Counter
import plotly.express as px

day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

def series_to_df(sr,label_titles="titles",label_values="values"):
    df = pd.DataFrame({label_titles:sr.index, label_values:sr.values})
    return df

# Will return count of messages of selected user per day having k(0/1/-1) sentiment
def week_activity_map(df,selected_user,k):
    if selected_user != 'Overall':
        df = df[df['user'] == selected_user]
    df = df[df['value'] == k]

    sentiment = "Neutral"
    if(k == 2):
        sentiment = "Positive"
    elif(k == 0):
        sentiment = "Negative"
    title = sentiment + " Weekly Activity"

    x_label = "Week day"
    y_label = "Occourance"

    series = df['day_name'].value_counts()
    sorted_series = series.reindex(day_order)
    dfx = series_to_df(sorted_series,x_label,y_label)

    fig = px.bar(dfx, x=x_label, y=y_label, title=title,  text=y_label )
    fig.update_layout(
        xaxis_title="Days in week",
        yaxis_title="Number of messages (Daily)",
    )
    return fig

# Will return count of messages of selected user per date having k(0/1/-1) sentiment
def daily_timeline(df,selected_user,k):
    if selected_user != 'Overall':
        df = df[df['user'] == selected_user]

    df = df[df['value'] == k]

    sentiment = "Neutral"
    if(k == 2):
        sentiment = "Positive"
    elif(k == 0):
        sentiment = "Negative"
    
    title = sentiment + " Timeline"

    timeline = df.groupby(['year', 'month_num', 'month']).count()['message'].reset_index()
    time = []
    for i in range(timeline.shape[0]):
        time.append(timeline['month'][i][:3] + "-" + str(timeline['year'][i]))
    timeline['time'] = time

    # count of message on a specific date
    # dfx = df.groupby('only_date').count()['message'].reset_index()
    # dfx.columns = ['titles','values']

    fig = px.line(timeline, x='time', y='message', title=title, text="message" )
    fig.update_layout(
        xaxis_title="Overall Timeline",
        yaxis_title="Occourances of sentiment words",
    )
    return fig

def most_common_words(df,selected_user,k):
    
    title = "Most used neutral words"
    if(k == 2):
        title = "Most used positive words"
    elif(k == 0):
        title = "Most used negative words"

    # with open("stop_hinglish.txt", "r") as f:
    #     stopwords = set(word.strip() for word in f.readlines())  # Remove newline characters

    if selected_user != 'Overall':
        df = df[df['user'] == selected_user]
    temp = df[df['message'] != '<Media omitted>\n']
    words = []
    for message in temp['message'][temp['value'] == k]:
        for word in message.lower().split():
            words.append(word[:5])
            # if word not in stopwords:
            #     words.append(word)
    dfx = pd.DataFrame(Counter(words).most_common(20), columns=['titles', 'values'])


    fig = px.bar(dfx, x='titles', y='values', title=title, text="values" )
    fig.update_layout(
        title_font=dict(size=24, color="darkblue"),
        xaxis_title="Words",
        yaxis_title="Occourances",
    )
    return fig

# def activity_heatmap(df,selected_user,k):
#     if selected_user != 'Overall':
#         df = df[df['user'] == selected_user]
#     df = df[df['value'] == k]
    
#     # Creating heat map
#     user_heatmap_df = df.pivot_table(index='day_name', columns='hour', values='message', aggfunc='count').fillna(0)

#     # fig, ax = plt.subplots()
#     fig, ax = plt.subplots()
#     ax = sns.heatmap(user_heatmap_df)
#     return fig
