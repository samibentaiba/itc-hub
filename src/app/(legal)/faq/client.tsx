// src/app/(legal)/faq/client.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, ChevronDown, Mail } from "lucide-react";
import Link from "next/link";
import type { LegalContent } from "@/lib/legal-content";

interface FAQClientProps {
  content: LegalContent["faq"];
}

export default function FAQClient({ content }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Filter questions based on search
  const filteredCategories = content.categories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {content.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {content.hero.subtitle}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {searchQuery ? (
          // Search Results View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Search Results ({filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)})
              </h2>
              <Button variant="ghost" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>

            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {`No results found for ${searchQuery}. Try different keywords.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                      <Badge variant="secondary">{category.questions.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {category.questions.map((q, idx) => {
                      const itemId = `${category.id}-${idx}`;
                      return (
                        <Collapsible
                          key={idx}
                          open={openItems.includes(itemId)}
                          onOpenChange={() => toggleItem(itemId)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between text-left h-auto py-4 hover:bg-accent"
                            >
                              <span className="font-medium pr-4">{q.question}</span>
                              <ChevronDown
                                className={`h-5 w-5 shrink-0 transition-transform ${
                                  openItems.includes(itemId) ? "transform rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4 text-muted-foreground">
                            {q.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Tabbed Categories View
          <Tabs defaultValue={content.categories[0].id} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
              {content.categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {content.categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {category.questions.length} questions
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.questions.map((q, idx) => {
                    const itemId = `${category.id}-${idx}`;
                    return (
                      <Card key={idx}>
                        <Collapsible
                          open={openItems.includes(itemId)}
                          onOpenChange={() => toggleItem(itemId)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between text-left h-auto py-4 px-6 hover:bg-accent rounded-lg"
                            >
                              <span className="font-medium pr-4 text-base">{q.question}</span>
                              <ChevronDown
                                className={`h-5 w-5 shrink-0 transition-transform ${
                                  openItems.includes(itemId) ? "transform rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-6 pb-6 text-muted-foreground">
                            {q.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Contact CTA */}
        <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="py-8 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">{content.contactCta.title}</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {content.contactCta.description}
            </p>
            <Button size="lg" asChild>
              <Link href={`mailto:${content.contactCta.email}`}>
                {content.contactCta.buttonText}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}