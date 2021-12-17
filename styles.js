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
            borderColor: '#22C55E' ,            
            //borderWidth: 3, if completed
            paddingVertical: 15,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "space-between"
        },
        container:{ 
            flexDirection: "row", 
            alignItems: "flex-start", 
            backgroundColor: "#ffffff" }
    },
    header: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between"
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
            justifyContent: "center"
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
        width: 120, 
        height: 120, 
        borderRadius: 40
    },
    inputTextBox:{
        box:{
            width: 100,
            height: 40,
            backgroundColor: '#fff',
            paddingVertical: 2,
            paddingHorizontal: 15,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius:9999, 
            fontSize: 16
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

    dropdown:
        {
              inputAndroid: {
                color: 'black',
                width: 278,
                height: 40,
                backgroundColor: '#fff',
                paddingHorizontal: 15,
                borderWidth: 0,
                borderBottomWidth: 0,
                borderRadius:9999, 
                fontSize: 16,
                marginBottom: 30,
                marginLeft: 8
              },
              
              container:
              {
                paddingBottom:50
              }
            },
    

}



export {styles}