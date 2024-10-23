import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/Ofppt.png';

const styles = StyleSheet.create({

    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px 5px 0 0',
    },
    logo: {
        height: '135px',
        width: '400px',
    },
    exam: {
        display: 'flex',
        flexDirection: 'column',
    },
    examHeader: {
        margin: '0',
        padding: '0',
        fontSize: '14px',

    },
    examControle: {
        border: '1px solid black',
        width: '450px',
        padding: '10px',
        textAlign:'center',
        marginLeft:'auto',
        marginRight:'auto',
    },
    examInfo: {
        borderBottom: '1px solid black',
        width: '500px',
        padding: '10px',
        marginTop: '10px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    section: {
        marginLeft: '50px',

    },
    sectionAnswer: {

        marginTop: '5px',

    },
    question: {
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    answer: {
        fontSize: 12,
        marginLeft: 30,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowP: {
        fontWeight:'bold',
        fontSize: 14,
        padding:'3px',

    },
    choose:{
        marginLeft: '50px',
        marginBottom:'20px',
        fontWeight:'bold'
    }
});


export const generateQuestionsPDF = (questionsData, examInfo) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logo} alt="Logo" style={styles.logo} />
                    <View style={styles.exam}>
                        <View style={styles.examHeader}>
                            <View style={styles.examControle}>
                                <Text style={styles.rowP}>{examInfo.title}</Text>
                                <Text style={styles.rowP}>Année {examInfo.annee}</Text>
                            </View>
                            <View style={styles.examInfo}>
                                <View style={styles.row}>
                                    <View>
                                        <Text style={styles.rowP}>Filière : {examInfo.filiere}</Text>
                                        <Text style={styles.rowP}>Niveau : {examInfo.niveau}</Text>
                                        <Text style={styles.rowP}>Module : {examInfo.module}</Text>
                                    </View>
                                    <View>

                                        <Text style={styles.rowP}>Durée : {examInfo.duree}</Text>
                                        <Text style={styles.rowP}>Barème : /20 points</Text>
                                        <Text style={styles.rowP}>Date : {examInfo.date}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={styles.choose}>- Choisir la ou les bonnes réponses</Text>
                <View style={styles.section}>
                    {questionsData.map((question, index) => (
                        <View key={index} style={styles.question}>
                            <Text >{`${index + 1}- ${question.question_text}`}</Text>
                            <View style={styles.sectionAnswer}>
                                {JSON.parse(question.reponses).map((reponse, idx) => (
                                    <Text key={idx} style={styles.answer}>{`${String.fromCharCode(97 + idx)}) ${reponse.reponse_text}`}</Text>
                                ))}
                            </View>
                        </View>
                    )
                    )}
                </View>
            </Page>
        </Document>

    );
};
export const generateAnswersPDF = (answersData, examInfo) => {
    const pdfDoc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logo} alt="Logo" style={styles.logo} />
                    <View style={styles.exam}>
                        <View style={styles.examHeader}>
                            <View style={styles.examControle}>
                                <Text style={styles.rowP}>{examInfo.title}</Text>
                                <Text style={styles.rowP}>Année {examInfo.annee}</Text>
                            </View>
                            <View style={styles.examInfo}>
                                <View style={styles.row}>
                                    <View>
                                        <Text style={styles.rowP}>Filière : {examInfo.filiere}</Text>
                                        <Text style={styles.rowP}>Niveau : {examInfo.niveau}</Text>
                                        <Text style={styles.rowP}>Module : {examInfo.module}</Text>
                                    </View>
                                    <View>

                                        <Text style={styles.rowP}>Durée : {examInfo.duree}</Text>
                                        <Text style={styles.rowP}>Barème : /20 points</Text>
                                        <Text style={styles.rowP}>Date : {examInfo.date}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={{ marginTop: '10px' }}>Correction</Text>
                </View>
                <View style={styles.section}>
                    {answersData.map((question, index) => (
                        <View key={index} style={styles.question}>
                            <Text >{`${index + 1}- ${question.question_text}`}</Text>
                            <View style={styles.sectionAnswer}>
                                {JSON.parse(question.reponses).filter(rep => rep.correcte).map((reponse, idx) => (
                                    <Text key={idx} style={styles.answer}>{reponse.reponse_text}</Text>
                                ))}
                            </View>
                        </View>
                    )
                    )}
                </View>
            </Page>
        </Document>
    );
    return pdfDoc;
};
