// src/app/(legal)/faq/client.tsx
"use client";

import { useState, useMemo, useCallback, memo } from "react";
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
import type { FAQContent, FAQCategory } from "@/types/legal";

interface FAQClientProps {
  content: FAQContent;
}

interface QuestionItemProps {
  question: string;
  answer: string;
  itemId: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const QuestionItem = memo(({ question, answer, itemId, isOpen, onToggle }: QuestionItemProps) => (
  <Card className="p-0">
    <Collapsible open={isOpen} onOpenChange={() => onToggle(itemId)}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-left h-auto px-6 hover:bg-accent rounded-lg"
          aria-expanded={isOpen}
        >
          <span className="font-medium py-4  pr-4 text-base">{question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-6 text-muted-foreground">
        {answer}
      </CollapsibleContent>
    </Collapsible>
  </Card>
));
QuestionItem.displayName = "QuestionItem";

const SearchBar = memo(({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="max-w-xl mx-auto relative">
    <label htmlFor="faq-search" className="sr-only">Search for answers</label>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
    <Input
      id="faq-search"
      type="search"
      placeholder="Search for answers..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 h-12 text-base"
      aria-label="Search frequently asked questions"
    />
  </div>
));
SearchBar.displayName = "SearchBar";

const CategoryTab = memo(({ category }: { category: FAQCategory }) => (
  <TabsTrigger
    value={category.id}
    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <span aria-hidden="true">{category.icon}</span>
    <span className="hidden sm:inline">{category.name}</span>
  </TabsTrigger>
));
CategoryTab.displayName = "CategoryTab";

const SearchResults = memo(({ 
  filteredCategories, 
  openItems, 
  toggleItem, 
  onClearSearch 
}: {
  filteredCategories: FAQCategory[];
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  onClearSearch: () => void;
}) => {
  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Search Results ({totalResults})
        </h2>
        <Button variant="ghost" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>

      {totalResults === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No results found. Try different keywords.
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span aria-hidden="true">{category.icon}</span>
                {category.name}
                <Badge variant="secondary">{category.questions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.questions.map((q, idx) => {
                const itemId = `${category.id}-${idx}`;
                return (
                  <QuestionItem
                    key={itemId}
                    question={q.question}
                    answer={q.answer}
                    itemId={itemId}
                    isOpen={openItems.has(itemId)}
                    onToggle={toggleItem}
                  />
                );
              })}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
});
SearchResults.displayName = "SearchResults";

const CategoryContent = memo(({ 
  category, 
  openItems, 
  toggleItem 
}: {
  category: FAQCategory;
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}) => (
  <TabsContent value={category.id} className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-3xl" aria-hidden="true">{category.icon}</span>
      <div>
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <p className="text-sm text-muted-foreground">
          {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
        </p>
      </div>
    </div>

    <div className="space-y-2" role="list">
      {category.questions.map((q, idx) => {
        const itemId = `${category.id}-${idx}`;
        return (
          <QuestionItem
            key={itemId}
            question={q.question}
            answer={q.answer}
            itemId={itemId}
            isOpen={openItems.has(itemId)}
            onToggle={toggleItem}
          />
        );
      })}
    </div>
  </TabsContent>
));
CategoryContent.displayName = "CategoryContent";

const ContactCTA = memo(({ title, description, buttonText, email }: {
  title: string;
  description: string;
  buttonText: string;
  email?: string;
}) => (
  <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
    <CardContent className="py-8 text-center">
      <Mail className="h-12 w-12 mx-auto mb-4 text-primary" aria-hidden="true" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        {description}
      </p>
      <Button size="lg" asChild>
        <Link href={`mailto:${email}`}>
          {buttonText}
        </Link>
      </Button>
    </CardContent>
  </Card>
));
ContactCTA.displayName = "ContactCTA";

export default function FAQClient({ content }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const lowerQuery = searchQuery.toLowerCase();
    return content.categories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(lowerQuery) ||
            q.answer.toLowerCase().includes(lowerQuery)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchQuery, content.categories]);

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {content.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {content.hero.subtitle}
          </p>
          
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {searchQuery ? (
          <SearchResults
            filteredCategories={filteredCategories}
            openItems={openItems}
            toggleItem={toggleItem}
            onClearSearch={clearSearch}
          />
        ) : (
          <Tabs defaultValue={content.categories[0]?.id} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
              {content.categories.map((category) => (
                <CategoryTab key={category.id} category={category} />
              ))}
            </TabsList>

            {content.categories.map((category) => (
              <CategoryContent
                key={category.id}
                category={category}
                openItems={openItems}
                toggleItem={toggleItem}
              />
            ))}
          </Tabs>
        )}

        <ContactCTA
          title={content.contactCta.title}
          description={content.contactCta.description}
          buttonText={content.contactCta.buttonText}
          email={content.contactCta.email}
        />
      </main>
    </div>
  );
}