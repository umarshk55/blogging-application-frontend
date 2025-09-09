import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import Base from "../components/Base";
import { useState,useContext } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../services/user-service";
import { doLogin } from "../auth";
import { useNavigate } from "react-router-dom";
import userContext from "../context/userContext";

const Login=()=>{

    const userContextData=useContext(userContext)

    const navigate=useNavigate()

    const [loginDetail,setLoginDetail]=useState({
        username:'',
        password:''
    })

    const handleChange=(event,field)=>{

        let actualValue=event.target.value;
        setLoginDetail({
            ...loginDetail,
            [field]:actualValue
        })
    }

    const handleReset = () => {
        setLoginDetail({
            username:"",
            password:"",
        });
    };

    const handleFormSubmit=(event)=>{
        event.preventDefault();
        console.log(loginDetail);
        //validation
        if(loginDetail.username.trim()==='' || loginDetail.password.trim()===''){
            toast.error("Username or Password is required !!")
            return;
        }

        //submit the data to server to generate token
        loginUser(loginDetail).then((data)=>{
            console.log("user login: ")
            console.log(data)

            //save the data to localStorage
            doLogin(data,()=>{
                console.log("login detail is saved to localstorage")
                //redirect to user dashboard page
                userContextData.setUser({
                    data:data.user,
                    login:true,
                })
                navigate("/user/dashboard")
            })
            toast.success("Login Success")
        }).catch(error=>{
            console.log(error)
            if(error.response.status===400 || error.response.status===404){
                toast.error(error.response.data.message)
            }else{
                toast.error("Something went wrong on server !!")
            }
            
        })
    };

    return (
        <Base>
        <Container>
            <Row className="mt-4">
                <Col sm={{size:6,offset:3}}>
                <Card color="dark" inverse>
                    <CardHeader>
                        <h2 className="text-center">Login Here !!</h2>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleFormSubmit}>
                            {/* email field */}
                            <FormGroup>
                                <label htmlFor="email">Email</label>
                                <Input
                                type="text"
                                id="email"
                                placeholder="Enter here"
                                value={loginDetail.username}
                                onChange={(e)=> handleChange(e,'username')}
                                />
                            </FormGroup>
                            {/* password field */}
                            <FormGroup>
                                <label htmlFor="password">Password</label>
                                <Input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={loginDetail.password}
                                onChange={(e)=> handleChange(e,'password')}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Container className="text-center">
                                    <Button color="success" outline >Login In</Button>
                                    <Button onClick={handleReset} className="ms-2" color="secondary">Reset</Button>
                                </Container>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
                </Col>
            </Row>
        </Container>
        </Base>
    );
};

export default Login;