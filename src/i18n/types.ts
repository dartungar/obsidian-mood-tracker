export interface I18nResources {
    commands: {
        openTracker: string;
        openHistory: string;
    };
    ribbon: {
        openTracker: string;
        openHistory: string;
    };
    modals: {
        tracker: {
            title: string;
            dateTime: string;
            note: string;
            notePlaceholder: string;
            save: string;
            cancel: string;
        };
        stats: {
            title: string;
            noEntries: string;
            noData: string;
            averageMood: string;
            mostCommonMood: string;
            mostCommonEmotions: string;
            editEntry: string;
            deleteEntry: string;
        };
        deleteEntry: {
            title: string;
            message: string;
            confirm: string;
            cancel: string;
        };
        emotionGroupEdit: {
            title: string;
            name: string;
            color: string;
            textColor: string;
            emotions: string;
            addEmotion: string;
            emotionPlaceholder: string;
            save: string;
            cancel: string;
        };
        emotionGroupDelete: {
            title: string;
            message: string;
            confirm: string;
            cancel: string;
        };
        moodRatingLabels: {
            title: string;
            description: string;
            labelSize: string;
            save: string;
            cancel: string;
        };
        moveData: {
            title: string;
            message: string;
            move: string;
            cancel: string;
        };
        createFile: {
            title: string;
            message: string;
            create: string;
            cancel: string;
        };
        confirmation: {
            confirm: string;
            cancel: string;
        };
    };
    settings: {
        title: string;
        trackerModalTitle: {
            name: string;
            desc: string;
        };
        folderPath: {
            name: string;
            desc: string;
            placeholder: string;
            folderNotExist: string;
        };
        chartColor: {
            name: string;
            desc: string;
        };
        moodRatingLabels: {
            name: string;
            desc: string;
            edit: string;
        };
        addToJournal: {
            name: string;
            desc: string;
        };
        journalPath: {
            name: string;
            desc: string;
            placeholder: string;
        };
        journalLocation: {
            name: string;
            desc: string;
            placeholder: string;
        };
        entryTemplate: {
            name: string;
            desc: string;
            placeholder: string;
        };
        sortEmotions: {
            name: string;
            desc: string;
        };
        useEmotions: {
            name: string;
            desc: string;
        };
        emotionGroups: {
            name: string;
            desc: string;
            add: string;
            edit: string;
            delete: string;
            noGroups: string;
        };
    };
    moodRatings: {
        veryBad: string;
        bad: string;
        ok: string;
        good: string;
        veryGood: string;
    };
    emotionGroups: {
        loveAndJoy: string;
        neutralAndSurprise: string;
        angerAndStress: string;
        sadnessAndFear: string;
    };
    emotions: {
        // Love and joy
        joyful: string;
        content: string;
        pleased: string;
        satisfied: string;
        happy: string;
        amused: string;
        delighted: string;
        cheerful: string;
        jovial: string;
        blissful: string;
        proud: string;
        triumphant: string;
        optimistic: string;
        eager: string;
        hopeful: string;
        enthusiastic: string;
        excited: string;
        euphoric: string;
        enchanted: string;
        loving: string;
        romantic: string;
        affectionate: string;
        passionate: string;
        attracted: string;
        sentimental: string;
        compassionate: string;
        peaceful: string;
        relieved: string;
        // Neutral and surprise
        ok: string;
        fine: string;
        bored: string;
        surprised: string;
        shocked: string;
        dismayed: string;
        confused: string;
        disillusioned: string;
        perplexed: string;
        amazed: string;
        astonished: string;
        moved: string;
        touched: string;
        // Anger and stress
        stressed: string;
        angry: string;
        enraged: string;
        hateful: string;
        hostile: string;
        agitated: string;
        frustrated: string;
        irritated: string;
        annoyed: string;
        aggravated: string;
        envious: string;
        jealous: string;
        disgusted: string;
        contemptful: string;
        // Sadness and fear
        sad: string;
        hurt: string;
        agonizing: string;
        depressed: string;
        sorrowful: string;
        disappointed: string;
        displeased: string;
        shameful: string;
        regretful: string;
        guilty: string;
        neglected: string;
        isolated: string;
        lonely: string;
        despaired: string;
        grieving: string;
        powerless: string;
        fearful: string;
        scared: string;
        helpless: string;
        frightened: string;
        panicking: string;
        hystetical: string;
        insecure: string;
        inferior: string;
        inadequate: string;
        nervous: string;
        anxious: string;
        worried: string;
        dreadful: string;
        mortified: string;
    };
    notifications: {
        entrySaved: string;
        entryDeleted: string;
        entryUpdated: string;
        settingsSaved: string;
        errorSavingData: string;
        errorLoadingData: string;
        dataFileMoved: string;
        emotionGroupSaved: string;
        emotionGroupDeleted: string;
    };
    errors: {
        folderNotExist: string;
        fileNotFound: string;
        invalidData: string;
    };
}

export type TranslationKeys = keyof I18nResources;
export type NestedKeys<T> = T extends object
    ? { [K in keyof T]: `${K & string}${T[K] extends object ? `.${NestedKeys<T[K]>}` : ''}` }[keyof T]
    : never;

export type I18nKey = NestedKeys<I18nResources>;