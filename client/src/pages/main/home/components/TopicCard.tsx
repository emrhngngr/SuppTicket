"use client";
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TopicCardProps {
  id: string;
  title: string;
  link: string;
  description: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ id, title, link, description }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: ""
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  console.log("cardRef ==> ", cardRef);

  return (
    <div className="relative mb-4" ref={cardRef}>
      <Card className="cursor-pointer" onClick={() => navigate(`/topics/${link}`, { state: { id, title, description } })}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TopicCard;
