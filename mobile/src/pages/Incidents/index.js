import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Indidents() {

    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([])
    const [total, setTotal] = useState([])
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate("Detail", { incident });
    }

    async function loadIncidents() {

        if (loading) {
            return;
        }

        if (total > 0 && incidents.length === total) {
            return
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        setIncidents([...incidents, ...response.data])
        setTotal(response.headers['x-total-count'])
        setLoading(false)
        setPage(page + 1);

    }

    useEffect(() => {
        loadIncidents()
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve vidas</Text>

            <FlatList
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incidents => String(incidents.id)}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                //showsVerticalScrollIndicator={false}
                renderItem={({ item: incident }) => (

                    <View style={styles.incident}>

                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(incident.value)}
                        </Text>


                        <TouchableOpacity style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={17} color="#e02041"></Feather>
                        </TouchableOpacity>
                    </View>

                )}
            />
        </View>
    )
}