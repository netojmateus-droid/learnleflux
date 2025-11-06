import React from 'react';

const Offline: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Você está offline</h1>
            <p>Por favor, verifique sua conexão com a internet.</p>
            <p>Enquanto isso, você pode acessar suas lições previamente baixadas.</p>
        </div>
    );
};

export default Offline;