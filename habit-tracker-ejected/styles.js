import { styleColors } from './colors';

const styles =
{
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 4,
        borderRadius: 30,
        paddingVertical: 13,
        backgroundColor: styleColors.themeColor
    },
    buttonGoogle: {
        width: 200,
        marginTop: 4,
        borderRadius: 30,
        paddingVertical: 13,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },

    habit: {
        main: {
            backgroundColor: styleColors.white,
            flexDirection: "row",
            marginHorizontal: 16,
            marginVertical: 4,
            borderStyle: "dotted",
            borderRadius: 20,
            borderColor: styleColors.greenComp,
            paddingVertical: 15,
            paddingHorizontal: 18,
            alignItems: "center",
            justifyContent: "space-between"
        },
        container: {
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: "#ffffff"
        },
        completed: {
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2
        }

    },
    header: {
        main: {
            backgroundColor: styleColors.themeColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        home: {
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between"
        },
        default: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            paddingHorizontal: 16,
        },
        recap: {
            flexDirection: 'row',
            marginEnd: 10
        }

    },
    scrollView: {
        home: {
            backgroundColor: styleColors.background,
            marginHorizontal: 6
        },
        manage: {
            backgroundColor: styleColors.background,
            marginHorizontal: 6,
            paddingTop: 20
        }
    },
    profilePage: {
        profileCard: {

            backgroundColor: styleColors.background,
            marginHorizontal: 6,
            paddingTop: 5,
            backgroundColor: styleColors.themeColor,
            borderRadius: 20,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            width: "100%",
            height: "40%",
            alignItems: "center",
            marginBottom: 10,
        },
        container: {
            alignItems: "center",
        },
        valueBox: {
            backgroundColor: '#fff',
            paddingHorizontal: 8,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius: 9999,
            alignSelf: "flex-start",
            marginBottom: 12,
            fontSize: 24
        },
        label: {
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 12,
            alignSelf: "flex-start",
            paddingRight: 15,
        },
        line: {
            flexDirection: 'row',
            width: "80%",
            alignSelf: "flex-start"
        },
        button: {
            width: 200,
            marginTop: 4,
            borderRadius: 30,
            paddingVertical: 13,
            backgroundColor: styleColors.pbRed
        },
        user: {
            fontSize: 28,
            fontWeight: "600",
            paddingTop: 10,
            color: "white"
        },
        tracking: {
            fontSize: 20,
            fontWeight: "700",
            paddingTop: 5,
            color: "white"
        }

    },
    infoBox: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 18,
        justifyContent: "space-between",
        backgroundColor: "#f4f6fc",
        borderRadius: 20,
        marginVertical: 20,
        marginHorizontal: 6,

    },

    habitBox: {
        padding: 20,
        flexDirection: "row",
        backgroundColor: "#f4f6fc",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 6,

    },
    plusButton: {
        borderRadius: 20,
        marginHorizontal: 8
    },
    newHabit: {
        backgroundColor: "#F0F0F0",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginVertical: 4,

    },
    drawer: {
        header: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20
        },
        sepLine: {
            height: 2,
            backgroundColor: 'gray',
            borderRadius: 999
        },
        content: {
            backgroundColor: '#fff',
            paddingBottom: 500
        }

    },
    profilePic: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: "#a4a4a4"
    },

    profilePicBig: {
        width: 130,
        height: 130,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#a4a4a4",
        paddingBottom: 10
    },
    inputTextBox: {
        box: {
            backgroundColor: '#fff',
            paddingVertical: 2,
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius: 9999,
            fontSize: 16,
            //alignSelf: 'center',
            width: '95%'
        },
        container: { borderBottomWidth: 0 }
    },

    inputValueBox: {
        width: 30,
        height: 25,
        flex: 1,
        backgroundColor: '#f4f6fc',
        paddingHorizontal: 0,
        borderWidth: 0,
        paddingVertical: 0,
        borderBottomWidth: 0,
        borderRadius: 12,
        fontSize: 18,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"

    },

    profile: {
        inputName: {
            backgroundColor: '#f4f6fc',
            paddingHorizontal: 0,
            borderWidth: 2,
            paddingVertical: 0,
            borderBottomWidth: 0,
            borderRadius: 12,
            fontSize: 18,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"

        },
        container: {
            flex: 1,
            alignItems: "center",
            alignContent: "space-between",
            justifyContent: "flex-start",
            padding: 10,
            marginTop: "10%"
        },
    },

    checkBox: {
        container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',

        }
    },

    checkBoxDays: {
        container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            alignSelf: 'center',
            justifyContent: 'center'
        }

    },

    recapIcon: {
        position: "absolute",
        marginLeft: "85%"
    },

    dropdown: {
        inputAndroid: {
            color: 'black',
            height: 40,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius: 9999,
            fontSize: 16,
            width: '95%'
        },
        container: {
            paddingBottom: 50
        }
    },

    dropdownCategory: {
        inputAndroid: {
            color: 'black',
            height: 40,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius: 9999,
            fontSize: 16,
            marginBottom: 30,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '95%'
        },
        container: {
            paddingBottom: 50
        }
    },
    timePicker: {
        timeButton: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 20,
            borderWidth: 0,
            elevation: 0,
            marginBottom: 20,
        },

        text: {
            fontSize: 22,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            paddingBottom: 14
        },
        hour: {
            fontSize: 22,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            textDecorationLine: "underline"
        },
    },

    detailRecap: {
        alignSelf: 'center',
        fontSize: 16,
        marginBottom: '5%',
        fontWeight: 'bold'
    },

    recapScreen: {
        mainCap: {
            fontSize: 26,
            marginLeft: -4
        },
        subCap: {
            fontSize: 26,
            marginLeft: 2
        },
        content: {
            width: "95%",
            alignSelf: "center"
        },
        text: {
            fontSize: 24
        },
        textWeight: {
            fontSize: 24,
            color: "brown",
            fontWeight: '700'
        },
        textWeightWater: {
            fontSize: 24,
            color: styleColors.water,
            fontWeight: '700'
        },
        walk: {
            width: "90%",
            position: 'absolute',
            marginLeft: "15%"
        },
        drink: {
            position: 'absolute',
            marginLeft: "16%"
        },
        completed:
        {
            marginLeft: "2%"
        },
    },

    newHabitForm:
    {
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'space-between',
    },
    redIcon:
    {
        color: 'red',
        marginLeft: 5
    },
    centredBlock:
    {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    targetLabel:
    {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    pedometerLabel:
    {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 17
    },
    checkboxContainer:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centredCheck:
    {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'baseline'
    },
    checkboxLabel:
    {
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    halfCentred:
    {
        justifyContent: 'center',
        flex: 0.5
    },
    reminder:
    {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginRight: '-8%'
    },
    reminderPicker:
    {
        flex: 0.4,
        marginLeft: '-8%',
        marginTop: '3%'
    }



}



export { styles }