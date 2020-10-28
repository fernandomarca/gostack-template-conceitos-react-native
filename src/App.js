import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {

    const response = await api.post(`/repositories/${id}/like`);

    const likedRepository = response.data;//retorna o repositorio com like do back-end

    /**
     * Map para sobreescrever o repositorio que vem do back-end atualizado, 
     * no lugar do repositorio presente na variavel de ESTADO.
     * O Map retorna um novo Array com todos os repositorios atualizados!!!
     */
    const repositoriesUpdated = repositories.map(repository => {
      if (repository.id === id) {
        return likedRepository;
      } else {
        return repository;
      }
    });

    //console.log(repositoriesUpdated);
    setRepositories(repositoriesUpdated);

    // const repository = repositories.find(repository => repository.id === id);

    // const newRepository = {
    //   ...repository,
    //   likes: repository["likes"] + 1,
    // };

    // const repositoriesFilter = repositories.filter(repository => repository.id !== id);

    // setRepositories([...repositoriesFilter, newRepository]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>
          <FlatList
            data={repositories}
            keyExtractor={repository => repository.id}
            renderItem={({ item: repository }) => (
              <>
                <Text key={repository.id} style={styles.repository}>{repository.title}</Text>

                {repository.techs.map(tech => (
                  <View key={tech} style={styles.techsContainer}>
                    <Text style={styles.tech}>
                      {tech}
                    </Text>
                  </View>
                ))}

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </>
            )}
          >
          </FlatList>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
