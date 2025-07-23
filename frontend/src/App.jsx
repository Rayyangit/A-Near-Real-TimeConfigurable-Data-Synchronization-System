import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import './App.css';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [formData, setFormData] = useState({
    local: { id: '', data: '' },
    cloud: { id: '', data: '' }
  });
  const [status, setStatus] = useState({ message: '', variant: '' });

  const handleSubmit = async (type, e) => {
    e.preventDefault();
    const { id, data } = formData[type];
    
    try {
      const parsedData = tryParseJson(data);
      await axios.post(`/${type}`, { id, data: parsedData });
      
      setFormData({ ...formData, [type]: { id: '', data: '' } });
      showStatus(`Data saved to ${type} successfully!`, 'success');
    } catch (error) {
      console.error(`Error saving to ${type}:`, error);
      const errorMsg = error.response?.data?.message || 
                     error.message || 
                     'Failed to save data';
      showStatus(`Error saving to ${type}: ${errorMsg}`, 'danger');
    }
  };

  const tryParseJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  const showStatus = (message, variant) => {
    setStatus({ message, variant });
    setTimeout(() => setStatus({ message: '', variant: '' }), 5000);
  };

  const handleInputChange = (type, field, value) => {
    setFormData({
      ...formData,
      [type]: { ...formData[type], [field]: value }
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Data Storage System</h1>

      {status.message && (
        <Alert variant={status.variant} className="mt-3">
          {status.message}
        </Alert>
      )}

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <strong>Local Storage</strong>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => handleSubmit('local', e)}>
                <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.local.id}
                    onChange={(e) => handleInputChange('local', 'id', e.target.value)}
                    required
                    placeholder="Enter unique identifier"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data (JSON format)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.local.data}
                    onChange={(e) => handleInputChange('local', 'data', e.target.value)}
                    required
                    placeholder='{"key": "value"}'
                  />
                  <Form.Text className="text-muted">
                    Enter valid JSON data to store locally
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save to Local
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <strong>Cloud Storage</strong>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => handleSubmit('cloud', e)}>
                <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cloud.id}
                    onChange={(e) => handleInputChange('cloud', 'id', e.target.value)}
                    required
                    placeholder="Enter unique identifier"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data (JSON format)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.cloud.data}
                    onChange={(e) => handleInputChange('cloud', 'data', e.target.value)}
                    required
                    placeholder='{"key": "value"}'
                  />
                  <Form.Text className="text-muted">
                    Enter valid JSON data to store in cloud
                  </Form.Text>
                </Form.Group>
                <Button variant="success" type="submit">
                  Save to Cloud
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;