import { View, Text, ScrollView, StyleSheet, TextInput, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import UserModal from '../components/UserModal'

export default function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  // const [searchedData, setSearchedData] = useState([])
  
  const searchResult = async (text) => {
    const URL = `http://192.168.43.209:3000/users?q=${text}`
    let result = await fetch(URL);
    result = await result.json();
    if (result){
      setData(result)
    }
  }

  const updateData = (data) => {
    setShowModal(true);
    setSelectedUser(data);
  }

  const deleteData = async (id) => {
    const URL = "http://192.168.43.209:3000/users"
    let result = await fetch(`${URL}/${id}`, {
      method: 'delete',
    })
    result = await result.json();
    if (result){
      console.log("User Deleted")
      getData();
    }
  }


  const saveData = async () => {
    const savedData = {
      name: name,
      email: email
    }
    const URL = "http://192.168.43.209:3000/users"
    let result = await fetch(URL, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(savedData)
    })
    // console.log(result)
  }

  const getData = async () => {
    const URL = "http://192.168.43.209:3000/users"
    let result = await fetch(URL);
    result = await result.json();
    setData(result);
    setLoading(false);
  }

  const handleSaveButton = () => {
    if (validateForm()){
      saveData();
    }
  }

  useEffect(() => { getData() }, [])

  const validateForm = () => {
    let err = {}
    if (!name){
      err.name = "Name is required"
    }

    if (!email){
      err.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)){
      err.email = "Email is invalid"
    }

    setErrors(err)
    return Object.keys(err).length === 0;
  }

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }
  
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>fetching data....</Text>
      </View>
      <View style={{padding: 10}}>

      <TextInput style={styles.dimensions} placeholder='name' value={name} onChangeText={setName}/>
      {errors.name ? <Text style={styles.textError}>*{errors.name}</Text> : null}
      <TextInput style={styles.dimensions} placeholder='email' value={email} onChangeText={setEmail} autoCapitalize="none"/>
      {errors.email ? <Text style={styles.textError}>*{errors.email}</Text> : null}
      <Button size="md" onPress={handleSaveButton}>Add User</Button>
      <TextInput placeholder='search' style={styles.search} onChangeText={(text) => searchResult(text)}/>
      </View>

      {
        loading ? <ActivityIndicator size="large" color="red"/> :
        <FlatList 
          data={data}
          renderItem={({item}) => {
            return (
              <View style={{ borderBottomWidth: 1, padding: 10 }}>
                <Text style={styles.text}>id: {item.id}</Text>
                <Text style={styles.text}>name: {item.name}</Text>
                <Text style={styles.text}>email: {item.email}</Text>
                <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                  <Button color="secondary" size='md' onPress={() => {updateData(item)}}>Update</Button>
                  <Button color="error" size='md' onPress={() => deleteData(item.id)}>Delete</Button>
                </View>
              </View>
            )
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }

      <Modal visible={showModal} transparent={true} animationType='slide'>
        <UserModal setShowModal={setShowModal} selectedUser={selectedUser} getData={getData}/>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  dimensions: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  textError: {
    color: 'red',
    fontSize: 13,
    fontWeight: 'bold'
  },
  search: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  }
})



// data.map((item) => {
//   return (
//     <View style={{ borderBottomWidth: 1, padding: 10 }}>
//       <Text style={styles.text}>id: {item.id}</Text>
//       <Text style={styles.text}>name: {item.name}</Text>
//       <Text style={styles.text}>email: {item.email}</Text>
//     </View>
//   )
// })