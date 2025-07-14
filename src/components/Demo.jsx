import React, { useEffect, useState } from 'react'; 
import { ActionIcon, Overlay, AspectRatio, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconQuestionMark } from '@tabler/icons-react';

function Demo( ) {

    const [overlayVisible, setOverlayVisible] = useState(true);  
    const [opened, { open, close }] = useDisclosure(false);

    const handleCloseDemoModal = () => {
        close(); 
        setOverlayVisible(false); 
    }; 

    
    return (
        <>

        <Modal 
            opened={opened} 
            onClose={handleCloseDemoModal} 
            size="xxl"
        >
            <iframe
                width="1000"
                height="600"
                src="https://www.youtube.com/embed/VG1BzzSli-8?si=htVvsBMLYN7x4qNt" 
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" // Added 'fullscreen' here
                referrerPolicy="strict-origin-when-cross-origin" 
            >
            </iframe>
        </Modal>
        <ActionIcon
            style={{
                zIndex: 100000000,
                position: 'absolute',
                right: 50,
                bottom: 10,
                animation: 'pulse 1s infinite alternate', 
            }}
            size='md'
            variant='default'
            radius='xl'
            onClick={open}
        >
            <IconQuestionMark size={20} color='white' />
        </ActionIcon>
        </>
    );
}
export default Demo;