import UserApi from '../../service/UserApi';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default func EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('');
  const { id,hash } = useParams()
  useEffect(() => {
    // Fonction pour vérifier l'e-mail lors du chargement de la page
    const verifyEmail = async () => {
      try {
        // Effectuer une requête à votre API pour vérifier l'e-mail
        const response = await UserApi.EmailVerification({id,hash})
        
        // Mettre à jour l'état de la vérification
        setVerificationStatus(response.data.message);
      } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la vérification de l\'e-mail:', error);
        setVerificationStatus('Une erreur est survenue lors de la vérification de votre adresse e-mail.');
      }
    };

    // Appeler la fonction de vérification d'e-mail lors du chargement de la page
    verifyEmail();
  }, []);

  return (
    <div>
      <h1>Vérification de l'adresse e-mail</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};
