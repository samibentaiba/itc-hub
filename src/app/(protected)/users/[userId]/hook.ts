"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Users,
    Star,
    TrendingUp,
    Award,
} from "lucide-react"

export function useUserProfile() {
    const params = useParams()
    const userId = params.userId as string
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // Simulate API call to fetch user data
        const fetchUser = async () => {
            setLoading(true)
            // Mock data - in real app, this would be an API call
            const mockUser = {
                id: userId,
                name: userId === "sami" ? "Sami" : userId === "yasmine" ? "Yasmine" : "Ali",
                realName: userId === "sami" ? "Sami Ben Ahmed" : userId === "yasmine" ? "Yasmine Trabelsi" : "Ali Mansouri",
                email: `${userId}@example.com`,
                phone: "+216 12 345 678",
                location: "Tunis, Tunisia",
                description:
                    userId === "sami"
                        ? "Senior Full Stack Developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers."
                        : userId === "yasmine"
                            ? "UI/UX Designer and Frontend Developer specializing in creating beautiful, user-friendly interfaces. Expert in React, TypeScript, and modern design systems."
                            : "Frontend Developer focused on React and modern web technologies. Always eager to learn new technologies and contribute to team success.",
                avatar: "/placeholder.svg?height=120&width=120",
                role: userId === "sami" ? "super_leader" : userId === "yasmine" ? "leader" : "member",
                joinDate: "2023-01-15",
                website: `https://${userId}.dev`,
                github: `https://github.com/${userId}`,
                linkedin: `https://linkedin.com/in/${userId}`,
                twitter: `https://twitter.com/${userId}`,
                teams: [
                    {
                        id: "t1",
                        name: "Frontend Team",
                        role: userId === "sami" ? "Team Lead" : userId === "yasmine" ? "Senior Developer" : "Developer",
                        joinDate: "2023-01-15",
                    },
                ],
                departments: [
                    {
                        id: "d1",
                        name: "UI/UX Department",
                        role: userId === "sami" ? "Department Head" : userId === "yasmine" ? "Senior Designer" : "Junior Developer",
                        joinDate: "2023-01-15",
                    },
                ],
                currentWork: [
                    {
                        id: "p1",
                        title: "ITC Hub Dashboard",
                        description: "Building the main dashboard interface",
                        progress: userId === "sami" ? 85 : userId === "yasmine" ? 70 : 45,
                        priority: "high",
                        dueDate: "2024-02-15",
                    },
                    {
                        id: "p2",
                        title: "Mobile App Design",
                        description: "Creating responsive mobile interface",
                        progress: userId === "sami" ? 60 : userId === "yasmine" ? 90 : 30,
                        priority: "medium",
                        dueDate: "2024-02-28",
                    },
                ],
                achievements: [
                    {
                        id: "a1",
                        title:
                            userId === "sami"
                                ? "Team Leadership Excellence"
                                : userId === "yasmine"
                                    ? "Design Innovation Award"
                                    : "Quick Learner",
                        description:
                            userId === "sami"
                                ? "Successfully led the frontend team to deliver 3 major projects ahead of schedule"
                                : userId === "yasmine"
                                    ? "Created the new design system that improved user satisfaction by 40%"
                                    : "Completed React certification and contributed to 5 projects in first 6 months",
                        category: userId === "sami" ? "Leadership" : userId === "yasmine" ? "Design" : "Development",
                        date: "2024-01-15",
                        icon: userId === "sami" ? Users : userId === "yasmine" ? Award : Star,
                    },
                    {
                        id: "a2",
                        title:
                            userId === "sami"
                                ? "Mentorship Champion"
                                : userId === "yasmine"
                                    ? "User Experience Expert"
                                    : "Team Collaboration",
                        description:
                            userId === "sami"
                                ? "Mentored 8 junior developers, with 100% retention rate"
                                : userId === "yasmine"
                                    ? "Improved app usability score from 3.2 to 4.8 stars"
                                    : "Excellent collaboration skills and positive team contribution",
                        category: userId === "sami" ? "Mentorship" : userId === "yasmine" ? "UX" : "Teamwork",
                        date: "2023-12-01",
                        icon: userId === "sami" ? Award : userId === "yasmine" ? TrendingUp : Users,
                    },
                ],
                skills: [
                    { name: "React", level: userId === "sami" ? 95 : userId === "yasmine" ? 90 : 75 },
                    { name: "TypeScript", level: userId === "sami" ? 90 : userId === "yasmine" ? 85 : 65 },
                    { name: "Node.js", level: userId === "sami" ? 85 : userId === "yasmine" ? 60 : 40 },
                    { name: "UI/UX Design", level: userId === "sami" ? 70 : userId === "yasmine" ? 95 : 50 },
                    { name: "Team Leadership", level: userId === "sami" ? 90 : userId === "yasmine" ? 80 : 60 },
                ],
                stats: {
                    projectsCompleted: userId === "sami" ? 24 : userId === "yasmine" ? 18 : 8,
                    teamsLed: userId === "sami" ? 3 : userId === "yasmine" ? 1 : 0,
                    mentorshipHours: userId === "sami" ? 120 : userId === "yasmine" ? 45 : 0,
                    codeReviews: userId === "sami" ? 156 : userId === "yasmine" ? 89 : 23,
                },
            }

            setTimeout(() => {
                setUser(mockUser)
                setLoading(false)
            }, 1000)
        }

        fetchUser()
    }, [userId])
    return { loading, user }
}