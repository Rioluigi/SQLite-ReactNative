import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  initDatabase,
  updateTodoStatus,
} from './src/databases/Sqlite';
import {Todo} from './src/types/types';
import TodoItem from './src/components/TodoItem';

const App = () => {
  useEffect(() => {
    initDatabase();
    loadTodos();
  }, []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const loadTodos = async () => {
    try {
      const result = await getTodos();
      setTodos(result);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul tugas tidak boleh kosong');
      return;
    }

    try {
      await addTodo(title, description);
      loadTodos();
      setTitle('');
      setDescription('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Gagal menambahkan tugas');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, currentStatus: number) => {
    try {
      await updateTodoStatus(id, currentStatus === 0);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#007bff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 36, fontWeight: 'bold', color: 'white'}}>
            Daftar Tugas
          </Text>
          <Text style={{fontSize: 24, color: 'white'}}>
            {todos.length} Tugas
          </Text>
        </View>
        <View style={{flex: 1, padding: 16}}>
          {todos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada tugas</Text>
              <Text style={styles.emptySubtext}>
                Tambahkan tugas baru dengan menekan tombol di bawah
              </Text>
            </View>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TodoItem
                  todo={item}
                  onDelete={() => handleDeleteTodo(item.id)}
                  onToggleComplete={() =>
                    handleToggleComplete(item.id, item.completed)
                  }
                />
              )}
            />
          )}
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: '#007bff',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
            + Tambah Tugas
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal closed');
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>

        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Tambah Tugas</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ced4da',
              borderRadius: 4,
              padding: 10,
              marginBottom: 12,
            }}
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ced4da',
              borderRadius: 4,
              padding: 10,
              marginBottom: 12,
            }}
            value={description}
            onChangeText={text => setDescription(text)}
            placeholder="Deskripsi"
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#28a745',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 16,
            }}
            onPress={handleAddTodo}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#6c757d',
  },
});

export default App;
