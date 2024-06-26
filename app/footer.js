import { Container, Card } from 'react-bootstrap';

export default function FooterPage() {
    return (
        <Container fluid>
            <Card className='text-center mt-3 p-5 bg-body-tertiary border border-0' body>
                &copy; Copyright All Right Reserved.
            </Card>
        </Container>
    );
}
