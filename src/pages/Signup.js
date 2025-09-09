import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, FormGroup, Input, Row } from "reactstrap";
import Base from "../components/Base";
import { signUp } from "../services/user-service";
import { toast } from "react-toastify";

const Signup = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        about: ""
    });

    const [error, setError] = useState({ errors: {}, isError: false });

  // Auto-focus on name field
    useEffect(() => {
        document.getElementById("name").focus();
    }, []);

  // Handle input changes and clear errors for that field
    const handleChange = (event, property) => {
        setData({ ...data, [property]: event.target.value });
        setError({ ...error, errors: { ...error.errors, [property]: null } });
    };

  // Reset form data
    const resetData = () => {
        setData({ name: "", email: "", password: "", about: "" });
        setError({ errors: {}, isError: false });
    };

  // Submit form
    const submitForm = (event) => {
        event.preventDefault();

    // Call backend API
    signUp(data)
        .then((resp) => {
        toast.success("User registered successfully! User ID: " + resp.id);
        resetData();
        })
        .catch((err) => {
            if (err.response && err.response.data) {
            setError({ errors: err.response.data, isError: true });
            } else {
            setError({ errors: { message: "Something went wrong!" }, isError: true });
            }
        });
    };

    return (
        <Base>
            <Container>
                <Row className="mt-4">
                    <Col sm={{ size: 6, offset: 3 }}>
                        <Card color="dark" inverse>
                            <CardHeader>
                                <h3 className="text-center">Fill Information to Register</h3>
                            </CardHeader>
                        <CardBody>
                        <Form onSubmit={submitForm}>
                        {/* Name Field */}
                        <FormGroup>
                            <label htmlFor="name">Enter Name</label>
                            <Input
                            type="text"
                            placeholder="Enter Here"
                            id="name"
                            value={data.name}
                            onChange={(e) => handleChange(e, "name")}
                            invalid={error.errors?.name ? true : false}
                            />
                        <FormFeedback>{error.errors?.name}</FormFeedback>
                    </FormGroup>

                    {/* Email Field */}
                    <FormGroup>
                        <label htmlFor="email">Enter Email</label>
                        <Input
                        type="email"
                        placeholder="Enter Here"
                        id="email"
                        value={data.email}
                        onChange={(e) => handleChange(e, "email")}
                        invalid={error.errors?.email ? true : false}
                        />
                        <FormFeedback>{error.errors?.email}</FormFeedback>
                    </FormGroup>

                    {/* Password Field */}
                    <FormGroup>
                        <label htmlFor="password">Enter Password</label>
                        <Input
                        type="password"
                        placeholder="Enter Here"
                        id="password"
                        value={data.password}
                        onChange={(e) => handleChange(e, "password")}
                        invalid={error.errors?.password ? true : false}
                        />
                        <FormFeedback>{error.errors?.password}</FormFeedback>
                    </FormGroup>

                    {/* About Field */}
                    <FormGroup>
                        <label htmlFor="about">About Yourself</label>
                        <Input
                        type="textarea"
                        placeholder="Enter Here"
                        id="about"
                        style={{ height: "250px" }}
                        value={data.about}
                        onChange={(e) => handleChange(e, "about")}
                        invalid={error.errors?.about ? true : false}
                        />
                        <FormFeedback>{error.errors?.about}</FormFeedback>
                    </FormGroup>

                    {/* Buttons */}
                    <div className="d-flex justify-content-center gap-2">
                        <Button
                        type="submit"
                            zcolor="light"
                        outline
                        disabled={!data.name || !data.email || !data.password}
                        >
                        Register
                        </Button>
                        <Button onClick={resetData} color="secondary" type="reset">
                        Reset
                        </Button>
                    </div>
                    </Form>
                </CardBody>
            </Card>
            </Col>
        </Row>
        </Container>
    </Base>
    );
};

export default Signup;
