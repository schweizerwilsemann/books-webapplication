import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/UserSlice";
import { toast } from "react-toastify";
import OAuth from "../components/Oauth";

export default function SignIn() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(signInStart());
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        values
      );

      if (response) {
        const { token } = response.data;
        localStorage.setItem("token", token);

        const currentUserInfo = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(signInSuccess(currentUserInfo.data));

        toast.success("Login Successfully");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (!isToastVisible) {
          toast.error("Invalid username or password");
          setIsToastVisible(true);
          setTimeout(() => setIsToastVisible(false), 3000);
          dispatch(signInFailure(error.response));
        }
        setError("Invalid username or password");
      } else {
        if (!isToastVisible) {
          toast.error("An unexpected error occurred. Please try again later.");
          setIsToastVisible(true);
          dispatch(signInFailure(error.response));
          setTimeout(() => setIsToastVisible(false), 3000);
        }
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error(">>>Login failed", error);
    }
  };

  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex flex-col p-3 max-w-3xl mx-auto md:flex-row md:items-center gap-5">
          {/* left side */}
          <div className="flex-1">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm 
                sm:text-xl font-semibold dark:text-white"
            >
              <span
                className="ml-0 px-5 py-4 bg-gradient-to-r from-rose-400
                    via-orange-300 to bg-yellow-100 text-purple-600"
              >
                ユニクロ
              </span>
              E-Books
            </Link>
            <p className="text-sm mt-5">This is a novel website</p>
          </div>
          {/* right side */}
          <div className="flex-1">
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              style={{
                maxWidth: 360,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                    height: "45px",
                    fontSize: "16px",
                  }}
                  prefix={<UserOutlined />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                    height: "45px",
                    fontSize: "16px",
                  }}
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to={""}>Forgot password</Link>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button
                  className="bg-orange-400 text-sky-50"
                  style={{
                    width: "100%",
                    height: "45px",
                    fontSize: "16px",
                  }}
                  block
                  type=""
                  htmlType="submit"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#FFFF00")
                  } // Màu nền khi hover
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f97316")
                  }
                >
                  Log in
                </Button>
                <OAuth />
                or{" "}
                <Link className="font-semibold text-rose-400" to={"/sign-up"}>
                  Register now!
                </Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
