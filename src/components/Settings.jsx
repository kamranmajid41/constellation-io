import { useState } from 'react'; 
import { useDisclosure } from '@mantine/hooks';
import { IconStopwatch, IconSettings, IconUpload, IconEye} from '@tabler/icons-react';
import { ActionIcon, Modal, Tabs, Box, FileInput, Text} from '@mantine/core'; 

function Settings({ setCustomTleData }) {
    const [opened, { open, close }] = useDisclosure(false);

    const handleFileUpload = (file) => {
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const uploadedJson = JSON.parse(e.target.result);

                const isValidTleJson = Array.isArray(uploadedJson) && uploadedJson.every(item =>
                    typeof item === 'object' && item !== null &&
                    typeof item.satelliteName === 'string' &&
                    typeof item.tleLine1 === 'string' &&
                    typeof item.tleLine2 === 'string'
                );

                if (isValidTleJson) {
                    setCustomTleData(uploadedJson); 
                    notifications.show({
                        title: 'Success!',
                        message: 'Custom constellation uploaded successfully. The map will update shortly.',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Invalid TLE JSON',
                        message: 'The uploaded file does not appear to be a valid TLE JSON format. Please ensure it is an array of objects with "satelliteName", "tleLine1", and "tleLine2" properties.',
                        color: 'red',
                    });
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                notifications.show({
                    title: 'File Read Error',
                    message: 'Could not read or parse the JSON file. Please ensure it is a valid JSON.',
                    color: 'red',
                });
            }
        };
        reader.readAsText(file); 
    };

    return (
        <>
            <ActionIcon
                variant="filled"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    backgroundColor: '#000',
                    color: '#fff',
                }}
                onClick={open}
            >
                <IconSettings size={24} />
            </ActionIcon>

            <Modal
                opened={opened}
                onClose={close}
                fullScreen
                title={<IconSettings size={24} />}
            >
                <Tabs defaultValue="inputs">
                    <Tabs.List>
                        <Tabs.Tab value="inputs" leftSection={<IconUpload size={18} />}>Inputs</Tabs.Tab>
                        <Tabs.Tab value="visibility" leftSection={<IconEye size={18} />}>Control Visibility</Tabs.Tab>
                        <Tabs.Tab value="outputs" leftSection={<IconStopwatch size={18} />}>Schedule Jobs</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="inputs" pt="xs">
                        <Box mt="md">
                            <Text size="sm" mb="xs" fw={500}>Upload TLE Constellation:</Text>
                            <FileInput
                                placeholder="No file selected"
                                accept=".json" 
                                onChange={handleFileUpload}
                                icon={<IconUpload size={16} />}
                                clearable
                            />
                            <Text size="xs" color="dimmed" mt="xs">
                                Accepts JSON files with an array of satellite objects. Each object must have `satelliteName`, `tleLine1`, and `tleLine2`.
                            </Text>
                        </Box>
                        <Box mt="md">
                            <Text size="sm" mb="xs" fw={500}>Upload Ground Topology:</Text>
                            <FileInput
                                placeholder="No file selected"
                                accept=".json" 
                                icon={<IconUpload size={16} />}
                                clearable
                            />
                            <Text size="xs" color="dimmed" mt="xs">
                            </Text>
                        </Box>
                        <Box mt="md">
                            <Text size="sm" mb="xs" fw={500}>Upload Circuits:</Text>
                            <FileInput
                                placeholder="No file selected"
                                accept=".json" 
                                icon={<IconUpload size={16} />}
                                clearable
                            />
                            <Text size="xs" color="dimmed" mt="xs">
                            </Text>
                        </Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="outputs" pt="xs">
                        <Text>Under construction!</Text>
                    </Tabs.Panel>
                     <Tabs.Panel value="visibility" pt="xs">
                        <Text>Under construction!</Text>
                    </Tabs.Panel>
                </Tabs>
            </Modal>
        </>
    );
};

export default Settings;