import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../config/firebase.config";
import useCurrentDate from "../../hooks/useCurrentDate";
import "./breakdown.css";

const Breakdown = ({ section, location, isBreakdown, ongoingBreakdown }) => {
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});

  const currentDate = useCurrentDate();
  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleBreakdownChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      breakdown_date: currentDate,
      breakdown_section_name: section,
      location: location,
      status: "ongoing",
      // addedBy: loggedInUser,
    });
  };

  const handleBreakdownUpdateChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({
      ...data,
      status: "completed",
      [id]: value,
    });
  };

  const handleBreakdownSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "breakdowns"), {
        ...data,
        timeStamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then(() => {
        e.target.reset();
        navigate("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBreakdownUpdate = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "breakdowns", ongoingBreakdown?.id);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-3 p-4 dangerZone">
      <Form onSubmit={handleBreakdownSubmit}>
        <Row>
          <Form.Group as={Col} md="4" controlId="startTime" className="mb-2">
            <Form.Label className="fw-bold">Start time</Form.Label>

            <Form.Control
              type="time"
              defaultValue={ongoingBreakdown?.startTime}
              disabled={ongoingBreakdown?.status === "ongoing"}
              required={isBreakdown}
              onChange={handleBreakdownChange}
            />
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="informedTo" className="mb-2">
            <Form.Label className="fw-bold">Informed to</Form.Label>

            <Form.Control
              type="text"
              defaultValue={ongoingBreakdown?.informedTo}
              disabled={ongoingBreakdown?.status === "ongoing"}
              required={isBreakdown}
              onChange={handleBreakdownChange}
            />
          </Form.Group>

          <Form.Group
            as={Col}
            md="4"
            controlId="supervisorName"
            className="mb-2"
          >
            <Form.Label className="fw-bold">Supervisor name</Form.Label>

            <Form.Control
              type="text"
              defaultValue={ongoingBreakdown?.supervisorName}
              disabled={ongoingBreakdown?.status === "ongoing"}
              required={isBreakdown}
              onChange={handleBreakdownChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="breakdownDetails" className="mb-2">
            <Form.Label className="fw-bold">Details</Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              defaultValue={ongoingBreakdown?.breakdownDetails}
              disabled={ongoingBreakdown?.status === "ongoing"}
              required={isBreakdown}
              onChange={handleBreakdownChange}
            />
          </Form.Group>

          {ongoingBreakdown?.status === "ongoing" && (
            <Form.Group as={Col} md="4" controlId="finishTime" className="mb-2">
              <Form.Label className="fw-bold">Finish time</Form.Label>
              <Form.Control
                type="time"
                required={isBreakdown}
                onChange={handleBreakdownUpdateChange}
              />
            </Form.Group>
          )}
        </Row>

        <div className="mt-5">
          {ongoingBreakdown?.status === "ongoing" ? (
            <button
              type="submit"
              className="btn-submit customBtn redZoneBtn"
              onClick={handleBreakdownUpdate}
            >
              Continue
            </button>
          ) : (
            <button type="submit" className="btn-submit customBtn redZoneBtn">
              Continue
            </button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Breakdown;
