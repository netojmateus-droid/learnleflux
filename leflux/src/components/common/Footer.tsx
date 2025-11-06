import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa' }}>
            <p>&copy; {new Date().getFullYear()} LeFlux. Todos os direitos reservados.</p>
            <p>
                <a href="/privacy-policy">Política de Privacidade</a> | 
                <a href="/terms-of-service"> Termos de Serviço</a>
            </p>
        </footer>
    );
};

export default Footer;