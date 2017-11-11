const Messages =
{
    STIR: 'STIR',
    OK: 'Ok',
    CANCEL: 'Cancel',
    NOTICE: 'Notice',
    ERROR_TITLE: 'Something went wrong',
    OOPS: 'Oops!',
    PLEASE_CONFIRM: 'Please Confirm',
    CANCEL_ALARM: 'Are you sure you want to cancel your wake-up message, {name}?',
    YES: 'Yes',
    NO: 'No',
    ALARM_EXISTS: 'You already have a wake-up set at that time. Please pick a different time.',
    HOME_TITLE:  'Welcome, we\'re glad you\'re here.',
    HOME_EXPLANATION: 'Stir is a personalized wake-up service that brings people gently into the new day.',
    HOME_CHOICE1:  'Sign up as a Sleeper to experience a wake-up message.',
    HOME_CHOICE2:  'Sign up as a Rouser if you\'d like to create wake-up messages for Sleepers.',
    HOME_ACTION:  'Would you like to join Stir as a Sleeper or a Rouser?',
    CLOCK_WELCOME:  'Welcome.',
    CLOCK_WELCOME_NAME:  'Welcome back, {name}',
    CLOCK_DESC:  "You have the following message scheduled:",
    CLOCK_DESC_NO_ALARMS:  "You have no wake-up messages scheduled.",
    ALARM_DATE:  "{date, date, short}",
    ALARM_TOMORROW:  "Tomorrow",
    ALARM_TODAY:  "Today",
    ALARM_LOCALES_SLEEPER: "I'd prefer to receive my wake-up message in:",
    ALARM_LOCALES_ROUSER: "I can record wake-up messages in:",
    CONTACT_PRONOUN: "What is your preferred pronoun?",
    CONTACT_PRONOUN_EXPLANATION: "We'll use this information to brief your Rouser.",
    HE: 'He',
    SHE: 'She',
    THEY: 'They',
    SLEEPER:  'SLEEPER',
    ROUSER:  'ROUSER',
    ROUSER_FOUND_SLEEPER: 'We have a Sleeper in need of a wake-up message.',
    ROUSER_SLEEPER_EXPLANATION: 'Once you record a message, you can record a message for another Sleeper.',
    ROUSER_NO_SLEEPERS: 'There are currently no Sleepers in need of a wake-up message.',
    ROUSER_NO_SLEEPERS_EXPLANATION: 'Check back here from time to time to assist Sleepers in need.',
    ANOTHER_SLEEPER: 'Find another Sleeper',
    BE_A_SLEEPER: 'Be a Sleeper',
    WAKE_he: 'Wake him',
    WAKE_she: 'Wake her',
    WAKE_they: 'Wake them',
    SLEEPER_NOTIFY: 'Hi {name}, this is a reminder from Stir. You have a wake-up message set for {time, time, short}. To ensure you wake up to your message, turn your ringer up and make sure DO NOT DISTURB is disabled.',
    ROUSER_NOTIFY: 'Hi {name}, this is Stir. There are new Sleepers in need of a wake-up message! Go now to {url}',
    HOME_SUGGEST_TAP: 'Tap',
    HOME_SUGGEST: 'to get a dedicated {role} app on your home screen!',
    ROUSER_WELCOME: 'Hello, and welcome to Stir. We\'re thrilled to have you join us as a Rouser.',
    ROUSER_WELCOME_1: 'Once you sign up, you\'ll be directed to a call queue where you\'ll find a Sleeper.',
    ROUSER_WELCOME_2: 'We\'ll provide you with some guidelines for how to personalize your message.',
    ROUSER_WELCOME_3: 'When you\'re ready, you\'ll receive a phone call you to record your message. Stir will then deliver the message to your Sleeper.',
    ROUSER_WELCOME_4: 'Thanks for joining our global network of Rousers giving people a fresh start to their day.',
    WELCOME: 'Welcome',
    BEGIN: 'Begin',
    SLEEPER_SUMMARY_DESCRIPTION: 'Hi {name}, we hope you enjoyed your personalized wake-up message from Stir.',
    SLEEPER_SUMMARY_FAILED: 'Hi {name}, Sorry we couldn\'t deliver your wake-up message',
    BE_A_ROUSER: 'Want to be a Rouser?',
    SLEEPER_SUMMARY_MESSAGE: 'Good morning, {name}! Check out your wake-up summary from Stir at {url}',
    NOTICE: 'Notice',
    PHONE_EXISTS: 'There is already a registered device with this phone number. Switch to this device?',
    FAIL_NOTIFY: 'This is a message from Stir. we\'re sorry {name}, but due to an analysis failiure you wake-up at {time, time, short} will not be delivered',
    SLEEPER_WELCOME: 'If you\'re like nearly half of the other humans in the world, you woke up this morning underslept. Our aim is to make that transition just a little bit better.',
    SLEEPER_WELCOME_1: 'Put your morning in our hands, we\'ve got you.',
    HOW_IT_WORKS: 'How it works:',
    HOW_WORKS_1: 'Set your wake-up time.',
    HOW_WORKS_2: 'Sign up with your Facebook or Twitter. Our algorithms will analyze your data to understand you and your morning needs.',
    HOW_WORKS_3: 'A Rouser will create a personalized message for you.',
    HOW_WORKS_4: 'You\'ll receive a call with the message to wake you up tomorrow morning.',
    PRIVACY_DISCLAMER_1: '*No personally identifiable information will be stored or shared. Click ',
    PRIVACY_DISCLAMER_2: 'here',
    PRIVACY_DISCLAMER_3: ' for more info.',
    SLEEPER_TIME_WHEN: 'When would you like to wake up?',
    SLEEPER_TIME_DISCLAMER: 'We\'ll deliver your message in your local time zone. Stir needs at least {hours} hours to prepare your message.',
    PERSONALITY_DESCRIPTION: 'Stir uses data analysis methods to personalize your wake-up experience.',
    PERSONALITY_DISCLAIMER_1: '*For best results, select the service you use most often.',
    PERSONALITY_DISCLAIMER_2: 'No personally identifiable information will be stored or shared.',
    QUESTIONS_DESCRIPTION: 'In order to personalize your wake-up experience, we\'ll need a bit more information.',
    QUESTIONS_NAME: 'First, what\'s your name?',
    QUESTIONS_ORDER: 'Please order the following by how relevant they are to you:',
    QUESTION_1: 'I put other people\'s needs before my own and value cooperation and harmony.',
    QUESTION_2: 'I value hard work and am organized in my approach to life\'s tasks.',
    QUESTION_3: 'I am stimulated by the company of others and value my relationships.',
    QUESTION_4: 'I am sensitive to my environment and have a depth of emotional experiences.',
    QUESTION_5: 'I am drawn to experience a variety of activities and value creative exploration.',
    SLEEPER_CONTACT_THANKS: 'Thanks, {name}',
    SLEEPER_CONTACT_EXPLANATION: 'We\'ll need your phone number to deliver your wake-up message.',
    CONTACT_EXPLANATION: 'After this, you\'ll be asked to verify your number with a 4-digit code.',
    ROUSER_CONTACT: 'First, enter your phone number.*',
    ROUSER_CONTACT_DISCLAIMER: '*Why do we need this info? We give you a call when you\'re ready to record your wake-up messages. Just follow the steps on the following screens.',
    CONTACT_DISCLAIMER: 'The incoming calls from STIR are all coming from a toll free number and thus should be at no cost. However, by taking part in the STIR project, I agree to cover any exceptional phone costs billed by my mobile phone service provider incurred from my participation as a "Rouser" or a "Sleeper".',
    CONTACT_VERIFY: 'Great. Please enter your verification code.',
    CONTACT_VERIFY_NAME: 'Great, {name}. Please enter your verification code.',
    ALARM_LOCALES_DISCLAIMER_SLEEPER: 'Select all the languages you speak to enhance your chances of a great wake-up message.',
    ALARM_LOCALES_DISCLAIMER_ROUSER: 'Select all the languages you speak to wake up Sleepers all around the world',
    ROUSER_RECORD_DESCRIPTION: 'Once you\'ve read the prompt below, press the button to record your message.',
    ROUSER_RECORD_NOTICE: 'We\'ll give you a call to do the recording, so keep an eye on your phone.',
    PROMPT_INTRO: 'Today you\'ll be waking {name}.',
    PROMPT_INSTRUCTION: 'For your message to {name}, consider the following, and feel free to elaborate:',
    RECORD_ACTION: 'Receive a call to leave a message',
    ROUSER_MIX_DESCRIPTION: 'Here\'s a preview of your wake-up message.',
    ROUSER_MIX_1: 'We mixed your message with some personalized music for the Sleeper.',
    ROUSER_MIX_2: 'If you\'re happy, submit your message and we\'ll deliver it to your Sleeper.',
    ROUSER_MIX_3: 'If you\'d like to rerecord, we\'ll call you back.',
    RERECORD: 'Rerecord',
    SUBMIT_MESSAGE: 'Submit Message',
    TOO_EARLY_CONFIRM: 'Stir needs at least {hours} hours to prepare your message. We can set your wake-up for the follwing day.',
    ALARM_FAILED_NOTIFY: 'Hi {name}, This is a message from Stir. We tried to deliver your message at {time, time, short}, but unfortunately the call didn\'t go through. You can still hear your wake-up and see a summary here: {url}',
    LISTEN_ALARM: 'You can listen again to your wake-up message here:',
    YOUR_TRAITS: 'Your Rouser recorded your personlized message based on the following psychometric analysis of your data:',
    ENGLISH: 'English',
    FRENCH: 'French',
    GERMAN: 'German',
    NEXT: 'Next',
    CONNECT_FACEBOOK: 'Connect with Facebook',
    CONNECT_TWITTER: 'Connect with Twitter',
    NOT_SOCIAL: 'Not on social media?',
    SUBMIT: 'Submit',
    NEW_ALARM_NOTIFICATION: 'Wake-up message set for {hours} hours and {minutes} minutes from now.',
    NEW_ALARM_NOTIFICATION_1DAY: 'Wakeup message set for 1 day, {hours} hours and {minutes} minutes from now.',
    LANGUAGE_REQUIREMENT: 'You can record the message in one of the following languages:',
    ALARM_DELIVERED: 'Your wake-up message was just delivered to {name}! Thank you from Stir.',
    FB_NO_PERMISSION: 'Stir requires permission to read your posts in order to personalized your wake-up message',
    ALARM_SUMMARY_AUTH_ERROR: 'A wakeup summary can only be viewed from the device that created the wake-up',
    SEND_FEEDBACK_DESC: 'Liked your message? You can send a one time feedback to your rouser',
    SEND_FEEDBACK: 'Send Feedback',
    FEEDBACK_MESSAGE: 'You received feedback from {name}: {text}',
    FEEDBACK_CANT_REACH: 'We couldn\'t reach your rouser!',
    ROUSER_WELCOME_DISCLAIMER: 'Your message must contain no illicit, defamatory or hateful content, because of the nature of the experience, there is an inherent risk that a user may receive a message that is not in accordance with the regulations. All participants acknowledge that the NFB and ARTE assume no responsibility for the reception of a message that is not in accordance with the regulations.',
    SLEEPER_WELCOME_DISCLAIMER: 'Even though the Rousers are warned that their message must contain no illicit, defamatory or hateful content, because of the nature of the experience, there is an inherent risk that a user may receive a message that is not in accordance with the regulations. All participants acknowledge that the NFB and ARTE assume no responsibility for the reception of a message that is not in accordance with the regulations.',
    CREDITS: 'CREDITS',
    EDIT: 'EDIT'
};

export default Messages;
