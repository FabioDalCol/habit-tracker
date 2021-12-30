import tw from 'tailwind-rn';
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
    buttonTry: [{                              //TO REMOVE JUST FOR REFERENCE
        width: 200,        
        marginTop: 4,
        borderRadius: 30,
        paddingVertical: 13,           
        },
        tw('pt-12')
        ],
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,        
    }, 
    
    habit:{
        main:{
            backgroundColor: styleColors.white,
            flexDirection: "row",
            marginHorizontal: 16,
            marginVertical: 4,
            borderRadius: 20,
            borderColor: styleColors.greenComp ,           
            paddingVertical: 15,
            paddingHorizontal: 18,
            alignItems: "center",
            justifyContent: "space-between"
        },
        container:{ 
            flexDirection: "row", 
            alignItems: "flex-start", 
            backgroundColor: "#ffffff" 
        },
        completed:{
            color: styleColors.greenComp, 
            marginTop: 0, 
            marginLeft:-2
        }

    },
    header: {
        home:{
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between"
        },
        default:{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            paddingHorizontal: 16,
        }
        
    },
    scrollView:{
        home:{
            backgroundColor: styleColors.background,
            marginHorizontal: 6
        },
        manage:{
            backgroundColor: styleColors.background,
            marginHorizontal: 6,
            paddingTop: 20        
        }
    },
    profileCard:{
        
        backgroundColor: styleColors.background,
        marginHorizontal: 6,
        paddingTop: 20   ,
        backgroundColor: styleColors.themeColor,
        borderRadius: 20,   
        width: "95%",
        height: "40%"
        
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
    drawer:{
        header:{
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center",
            paddingVertical: 20
        },
        sepLine:{
            height: 2, 
            backgroundColor: 'gray', 
            borderRadius:999
        },
        content: {
            backgroundColor:'#fff', 
            paddingBottom:500 
        }

    },
    profilePic:{
        width: 110, 
        height: 110, 
        borderRadius: 60,
        borderWidth: 1,
        borderColor:"#a4a4a4"
    },

    profilePicBig:{
        width: 180, 
        height: 180, 
        borderRadius: 99,
        borderWidth: 1,
        borderColor:"#a4a4a4"
    },
    inputTextBox:{
        box:{
            backgroundColor: '#fff',
            paddingVertical: 2,
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius:9999, 
            fontSize: 16,
            //alignSelf: 'center',
            width: '95%'
            },
        container:{borderBottomWidth: 0}        
    },

    inputValueBox:{
        width: 30,
        height: 25,
        flex:1,
        //flexDirection:'row',
        backgroundColor: '#f4f6fc',
        //paddingVertical: 2,
        paddingHorizontal: 0,
        borderWidth: 0,
        paddingVertical: 0,
        //marginTop:25,
        borderBottomWidth: 0,
        borderRadius:12, 
        fontSize: 18,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
        
    },
    
    profile:{        
        inputName:{
            //width: 30,
            //height: 25,            
            //flexDirection:'row',
            backgroundColor: '#f4f6fc',
            //paddingVertical: 2,
            paddingHorizontal: 0,
            borderWidth: 2,
            paddingVertical: 0,
            //marginTop:25,
            borderBottomWidth: 0,
            borderRadius:12, 
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
            marginTop:"10%"
        }, 
    },

    checkBox:{
        container:{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            
        }
    },

    checkBoxDays:{
        container:{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            alignSelf: 'center',
            justifyContent: 'center'            
        }
    
    },

    recapIcon:{
        position:"absolute", 
        marginLeft:"85%"
    },

    dropdown:{
        inputAndroid: {
            color: 'black',
            height: 40,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius:9999, 
            fontSize: 16,
            //marginBottom: 30,
            //justifyContent: 'center', 
            //alignSelf: 'center',
            width: '95%'
        },        
        container:{
            paddingBottom:50
        }
    },

    dropdownCategory:{
        inputAndroid: {
            color: 'black',
            height: 40,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius:9999, 
            fontSize: 16,
            marginBottom: 30,
            justifyContent: 'center', 
            alignSelf: 'center',
            width: '95%'
        },        
        container:{
            paddingBottom:50
        }
    },
    timePicker:{
        timeButton:{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 20,
            borderWidth:0,
           
            elevation: 0,
            //backgroundColor: "#4263ec",
            marginBottom: 20,
        },
    
        text:{
            fontSize: 22,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            paddingBottom: 14
            //color: 'white',
            },
        hour:{
            fontSize: 22,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            textDecorationLine: "underline"
            //color: 'white',
            },
    },
   
    
    detailRecap: {
        alignSelf:'center', 
        fontSize:16, 
        marginBottom:'5%', 
        fontWeight: 'bold'
    }     

}



export {styles}