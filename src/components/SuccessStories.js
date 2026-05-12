import React, { useState } from 'react';
import './SuccessStories.css';

const MOCK_STORIES = [
  {
    id: 1,
    author: "Vikram Malhotra",
    batch: "2019",
    company: "Google",
    role: "Senior Software Engineer",
    avatarColor: "#0284c7",
    title: "How I Cracked the Google Interviews After 4 Rejections",
    preview: "It took me 4 tries over 3 years, but I finally made it. Here is the complete breakdown of my preparation strategy, including the exact LeetCode patterns that helped me succeed...",
    fullText: `
      <p>I still remember the sting of my first Google rejection. It was 2020, and I thought I was ready. I wasn't. Over the next three years, I rebuilt my entire approach to technical interviews.</p>
      
      <h4>1. Stop grinding randomly</h4>
      <p>My biggest mistake initially was doing random LeetCode questions. What changed the game for me was categorizing problems by pattern (Sliding Window, Two Pointers, Top K Elements, etc.). Once you understand the underlying pattern, you can solve any variation they throw at you.</p>
      
      <h4>2. System Design is about tradeoffs</h4>
      <p>For the System Design rounds, I stopped trying to memorize architecture diagrams. Instead, I focused on understanding the *why*. Why use Cassandra over PostgreSQL here? Why use a message queue? Be prepared to justify your tradeoffs.</p>
      
      <h4>3. The Behavioral Round Matters</h4>
      <p>Google looks for "Googleyness." Don't brush off the behavioral interviews. Have 4-5 core stories prepared using the STAR method that highlight leadership, handling conflict, and navigating ambiguity.</p>
      
      <p>To all the students currently grinding: keep going. It's a marathon, not a sprint!</p>
    `,
    date: "Oct 12, 2025"
  },
  {
    id: 2,
    author: "Sneha Patel",
    batch: "2021",
    company: "Stripe",
    role: "Product Manager",
    avatarColor: "#e11d48",
    title: "From Engineering to Product Management: My Transition",
    preview: "Switching from writing code to managing the product vision was the hardest pivot of my career. Here is how I leveraged my technical background to ace the PM interviews at Stripe...",
    fullText: `
      <p>Many engineers feel stuck on the technical track and wonder how to pivot into Product Management. Here is how I made the jump.</p>
      
      <h4>Embrace Your Technical Advantage</h4>
      <p>As a former engineer, you have a massive advantage: you know how long things actually take to build, and you can communicate deeply with the engineering team. Lean into this during your PM interviews.</p>
      
      <h4>Focus on the User, Not the Implementation</h4>
      <p>The hardest shift in mindset was stopping myself from thinking about *how* to build a feature, and forcing myself to ask *why* we should build it. You need to fall in love with the user's problem, not your proposed solution.</p>
      
      <h4>Prepare for the Execution Interviews</h4>
      <p>Stripe's interviews are notoriously rigorous. For the execution rounds, practice setting clear metrics. If user engagement drops by 10%, how do you debug it? Have a structured framework ready.</p>
    `,
    date: "Nov 04, 2025"
  },
  {
    id: 3,
    author: "Rohan Desai",
    batch: "2020",
    company: "Y Combinator",
    role: "Startup Founder",
    avatarColor: "#16a34a",
    title: "Building a Startup Right Out of College",
    preview: "Instead of taking the placement offers, my co-founder and I decided to build our own SaaS tool. We recently got accepted into Y Combinator. Here's our story...",
    fullText: `
      <p>Choosing to skip campus placements to build a startup was terrifying. Everyone else was celebrating their job offers, while we were working out of a tiny apartment trying to get our first 10 users.</p>
      
      <h4>Launch Before You Are Ready</h4>
      <p>We spent 4 months perfecting our V1. Big mistake. When we finally launched, no one cared. The features we thought were crucial didn't matter. Launch an ugly MVP in 2 weeks and talk to users immediately.</p>
      
      <h4>Getting into Y Combinator</h4>
      <p>YC cares about three things: Are you building something people want? Do you know your users deeply? Can your team execute fast? Our traction wasn't massive, but our growth rate was 15% week-over-week, which proved we were onto something.</p>
      
      <p>If you have the itch to build, do it now while your responsibilities are low.</p>
    `,
    date: "Dec 18, 2025"
  }
];

const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  const openModal = (story) => {
    setSelectedStory(story);
  };

  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="stories-container">
      <div className="stories-header">
        <h2>Success Stories & Career Blog</h2>
        <p>Read inspiring journeys and interview tips from alumni who have been exactly where you are.</p>
      </div>

      <div className="stories-grid">
        {MOCK_STORIES.map(story => (
          <div key={story.id} className="story-card" onClick={() => openModal(story)}>
            <div className="story-card-header">
              <div className="story-avatar" style={{ backgroundColor: story.avatarColor }}>
                {story.author.charAt(0)}
              </div>
              <div className="story-author-info">
                <h4>{story.author}</h4>
                <p>{story.role} @ <strong>{story.company}</strong></p>
              </div>
            </div>
            <div className="story-card-body">
              <h3 className="story-title">{story.title}</h3>
              <p className="story-preview">{story.preview}</p>
            </div>
            <div className="story-card-footer">
              <span className="story-date">{story.date}</span>
              <span className="story-read-more">Read Full Story ➜</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="story-modal-overlay" onClick={closeModal}>
          <div className="story-modal-content" onClick={e => e.stopPropagation()}>
            <button className="story-modal-close" onClick={closeModal}>✕</button>
            
            <div className="story-modal-header">
              <div className="story-avatar large" style={{ backgroundColor: selectedStory.avatarColor }}>
                {selectedStory.author.charAt(0)}
              </div>
              <div>
                <h2>{selectedStory.author}</h2>
                <p className="story-modal-role">
                  Batch of {selectedStory.batch} • {selectedStory.role} @ <strong>{selectedStory.company}</strong>
                </p>
                <span className="story-modal-date">Published on {selectedStory.date}</span>
              </div>
            </div>

            <div className="story-modal-body">
              <h1 className="story-main-title">{selectedStory.title}</h1>
              <div 
                className="story-html-content"
                dangerouslySetInnerHTML={{ __html: selectedStory.fullText }}
              />
            </div>
            
            <div className="story-modal-footer">
              <button className="story-connect-btn">Connect with {selectedStory.author.split(' ')[0]}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
