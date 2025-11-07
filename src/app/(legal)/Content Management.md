# Content Management Guide for Legal Pages

## 🎯 Quick Reference

All content for legal pages is centralized in **`src/lib/legal-content.ts`**

## 📝 How to Update Content

### Organization Information

Update your organization details (affects all pages):

```typescript
organization: {
  name: "Information Technology Community (ITC)", // Update your full name
  shortName: "ITC Hub",                           // Short version
  email: "contact.itc.blida@gmail.com",          // Contact email
  address: "BLIDA 01 University, Blida, Algeria",// Physical address
  founded: "2016",                                // Year founded
  website: "https://itc-hub.vercel.app"          // Your website URL
}
```

### About Page Content

#### Update Mission Statement
```typescript
mission: {
  title: "Our Mission",
  description: "Your mission statement here..."
}
```

#### Update Story
```typescript
story: {
  title: "Our Story",
  content: [
    "First paragraph of your story...",
    "Second paragraph...",
    "Third paragraph..."
  ]
}
```

#### Add/Edit Core Values
```typescript
values: [
  {
    title: "Innovation",                    // Value name
    description: "Description here..."      // What it means
  },
  // Add more values as needed
]
```

#### Add/Edit Events
```typescript
events: [
  {
    name: "ITC Talks",                     // Event name
    icon: "🎙️",                           // Emoji icon
    description: "Event description..."    // What it's about
  },
  // Add more events
]
```

#### Update Timeline
```typescript
achievements: [
  {
    year: "2016",                          // Year
    title: "Foundation",                   // Milestone name
    description: "What happened..."        // Details
  },
  // Add more milestones
]
```

#### Update Future Goals
```typescript
futureGoals: [
  "Goal 1...",
  "Goal 2...",
  "Goal 3...",
  // Add more goals
]
```

### FAQ Page Content

#### Add New Category
```typescript
categories: [
  {
    id: "new-category",                    // Unique ID (lowercase, hyphens)
    name: "Category Name",                 // Display name
    icon: "🔧",                           // Emoji icon
    questions: [
      // Add questions here
    ]
  }
]
```

#### Add New Question
```typescript
questions: [
  {
    question: "Your question here?",
    answer: "Your detailed answer here. Can be multiple sentences."
  }
]
```

#### Update Contact CTA
```typescript
contactCta: {
  title: "Still have questions?",
  description: "Can't find the answer you're looking for?...",
  buttonText: "Contact Support",
  email: "contact.itc.blida@gmail.com"
}
```

### Privacy Policy Content

#### Update Last Modified Date
```typescript
hero: {
  lastUpdated: "January 2025"  // Update this when you make changes
}
```

#### Add New Section
```typescript
sections: [
  {
    title: "New Section Title",
    content: [
      "First paragraph...",
      "Second paragraph..."
    ]
  }
]
```

#### Add Section with Subsections
```typescript
sections: [
  {
    title: "Main Section",
    subsections: [
      {
        subtitle: "Subsection Title",
        content: [
          "Content here...",
          "More content..."
        ]
      }
    ]
  }
]
```

### Terms of Service Content

Same structure as Privacy Policy. Update sections similarly.

## 🔄 Common Updates

### Changing Contact Email

Find and replace in `legal-content.ts`:
```typescript
// Old
email: "contact.itc.blida@gmail.com"

// New
email: "your-new-email@domain.com"
```

### Updating Organization Address

```typescript
address: "Your New Address, City, Country"
```

### Adding a New FAQ Category

1. Open `src/lib/legal-content.ts`
2. Find the `faq` → `categories` array
3. Add a new category object:

```typescript
{
  id: "billing",                    // Must be unique
  name: "Billing & Payments",       // Display name
  icon: "💳",                       // Pick an emoji
  questions: [
    {
      question: "Is ITC Hub free?",
      answer: "Yes, ITC Hub is completely free for all members."
    },
    // Add more questions
  ]
}
```

### Updating Privacy Policy Sections

Find the section you want to update:

```typescript
{
  title: "Data Security",           // Section you want to update
  content: [
    "We implement robust security measures...",  // Edit these paragraphs
    "All passwords are encrypted...",
    "However, no method of transmission..."
  ]
}
```

## 🎨 Formatting Tips

### Lists in Content
Use bullet points naturally:
```typescript
content: [
  "We collect the following information:",
  "• Name and email address",
  "• Password (encrypted)",
  "• Profile information"
]
```

### Links in Content
Mention URLs plainly:
```typescript
content: [
  "For more information, visit our website at https://itc-hub.vercel.app or contact us."
]
```

### Emphasis
Use markdown-style emphasis:
```typescript
content: [
  "This is **very important** to understand.",
  "You *should* read this carefully."
]
```

## 🔍 Finding What to Update

### By Page

| Want to update... | Look in... |
|-------------------|------------|
| About page mission | `about.mission` |
| About page story | `about.story.content` |
| About page values | `about.values` |
| About page events | `about.events` |
| FAQ questions | `faq.categories[n].questions` |
| Privacy sections | `policy.sections` |
| Terms sections | `terms.sections` |
| Contact info | `organization.email` & `organization.address` |

### By Type

| Want to change... | Search for... |
|-------------------|---------------|
| Email address | `email:` |
| Physical address | `address:` |
| Year founded | `founded:` |
| Last updated date | `lastUpdated:` |
| Mission statement | `mission.description` |

## ✅ Best Practices

### 1. Always Update "Last Updated"
When you change Privacy Policy or Terms:
```typescript
hero: {
  lastUpdated: "February 2025"  // ← Update this!
}
```

### 2. Keep Paragraphs Separate
```typescript
// Good ✅
content: [
  "First paragraph here.",
  "Second paragraph here."
]

// Avoid ❌
content: [
  "First paragraph here. Second paragraph here."
]
```

### 3. Use Clear Question Formatting
```typescript
// Good ✅
question: "How do I reset my password?"

// Avoid ❌
question: "password reset"
```

### 4. Write Complete Answers
```typescript
// Good ✅
answer: "To reset your password, click on 'Forgot Password' on the login page. You'll receive an email with a reset link that expires in 24 hours."

// Avoid ❌
answer: "Use forgot password feature"
```

### 5. Maintain Consistent Tone
- Use "we" when referring to ITC Hub
- Use "you" when referring to users
- Be professional but friendly
- Avoid jargon when possible

## 🚀 Testing Your Changes

After updating content:

1. **Save the file**
2. **Restart dev server** (if needed)
3. **Visit the page** in browser
4. **Check for**:
   - Typos or grammar errors
   - Broken formatting
   - Missing information
   - Outdated information

## 📋 Content Checklist

Before going live, ensure:

- [ ] Organization email is correct
- [ ] Organization address is correct
- [ ] "Last Updated" dates are current
- [ ] All questions have complete answers
- [ ] No placeholder text remains
- [ ] No Lorem ipsum text
- [ ] Links work correctly
- [ ] Information is accurate
- [ ] Legal terms are appropriate for your jurisdiction
- [ ] Privacy policy matches actual practices

## 🎓 Examples

### Adding a New Value

**Before:**
```typescript
values: [
  { title: "Innovation", description: "..." },
  { title: "Collaboration", description: "..." }
]
```

**After:**
```typescript
values: [
  { title: "Innovation", description: "..." },
  { title: "Collaboration", description: "..." },
  { title: "Sustainability", description: "We care about our environmental impact." }
]
```

### Adding a New FAQ

**Before:**
```typescript
questions: [
  { question: "What is ITC Hub?", answer: "..." }
]
```

**After:**
```typescript
questions: [
  { question: "What is ITC Hub?", answer: "..." },
  { question: "How do I join?", answer: "To join ITC Hub, click the Register button..." }
]
```

## 🆘 Need Help?

If you need to add content types not covered here:

1. Look at existing similar content
2. Copy the structure
3. Modify the values
4. Test thoroughly

Remember: The JSON structure is flexible. You can add fields, but don't remove required ones!

## 📱 Multi-Language Support (Future)

To prepare for translations, keep content concise and avoid:
- Idioms or cultural references
- Overly complex sentences
- Hardcoded formatting

This makes translation easier later!