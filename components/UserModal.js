import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from '@rneui/themed';

const UserModal = (props) => {
  const [name, setName] = useState('');
  const [email, SetEmail] = useState('');

  const updateUser = async () => {
    const URL = "http://192.168.43.209:3000/users"
    const id = props.selectedUser.id;
    
    let result = await fetch(`${URL}/${id}`, {
      method: 'put',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name, email})
    })
    result = await result.json();
    if(result){
      console.log(result);
      props.setShowModal(false)
      props.getData();
    }
  }

  useEffect(() => {
    if (props.selectedUser){
      setName(props.selectedUser.name);
      SetEmail(props.selectedUser.email);
    }
  }, [props.selectedUser])

  return (
    <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>For updations kindly fill this</Text>
            <TextInput placeholder='name' style={styles.dimensions} value={name} onChangeText={setName}/>
            <TextInput placeholder='email' style={styles.dimensions} value={email} onChangeText={SetEmail} autoCapitalize='none'/>
            <Button onPress={updateUser}>Update</Button>
            <Button onPress={() => {props.setShowModal(false)}}>close</Button>
          </View>
        </View>
  )
}

const styles = StyleSheet.create({
    centeredView:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      modalView: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.9,
        width: '80%',
        justifyContent: 'space-evenly',
        height: 300
      },
      dimensions: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
      },
      title: {
        fontWeight: '500',
      }
})

export default UserModal