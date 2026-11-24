import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Note from '../models/Note.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import FlashcardDeck from '../models/FlashcardDeck.js';
import StudyPlan from '../models/StudyPlan.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studymate';

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Note.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await FlashcardDeck.deleteMany({});
    await StudyPlan.deleteMany({});

    // Create Demo User
    const hashedPassword = await bcrypt.hash('studymate123', 10);
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'student@university.edu',
      password: hashedPassword,
      course: 'B.Tech Computer Science & Engineering',
      semester: 'Semester 3',
      subjects: ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks'],
      studyStreak: 4,
    });

    console.log('[Seed] Demo student created: student@university.edu / studymate123');

    // Create Demo Notes
    const note1 = await Note.create({
      title: 'Binary Search Trees & AVL Self-Balancing',
      subject: 'Data Structures',
      semester: 'Semester 3',
      tags: ['trees', 'algorithms', 'exam-prep', 'recursion'],
      structuredContent: `# Binary Search Trees (BST) & Self-Balancing AVL Trees

## Core Concepts & Overview
A **Binary Search Tree** is an ordered node-based binary tree data structure where each node has at most two children. The left subtree contains only nodes with keys strictly less than the node's key, and the right subtree contains keys strictly greater than the node's key.

When insertions occur in sorted order, an ordinary BST degenerates into a linear linked list with worst-case search complexity of **O(n)**. To guarantee logarithmic time bounds, self-balancing trees like **AVL Trees** enforce height balance invariants through subtree rotations.

## Key Definitions & Terminology
- **Balance Factor (BF)**: The difference in height between the left and right subtrees:
  $$\\text{BF}(node) = \\text{Height}(left\\_child) - \\text{Height}(right\\_child)$$
  An AVL tree strictly requires that for every node, $\\text{BF} \\in \\{-1, 0, 1\\}$.
- **LL Rotation (Single Right)**: Applied when a node is inserted into the left subtree of the left child.
- **RR Rotation (Single Left)**: Applied when an insertion occurs in the right subtree of the right child.
- **LR Rotation (Double)**: A left rotation on the child followed by a right rotation on the parent.
- **RL Rotation (Double)**: A right rotation on the child followed by a left rotation on the parent.

## Time & Space Complexities
| Operation | Average Case | Worst Case (Standard BST) | Worst Case (AVL Tree) |
| :--- | :--- | :--- | :--- |
| **Search** | O(log n) | O(n) | O(log n) |
| **Insertion** | O(log n) | O(n) | O(log n) |
| **Deletion** | O(log n) | O(n) | O(log n) |

## Exam Highlights & Common Pitfalls
1. **Always calculate Balance Factor after every insertion** starting from the newly inserted leaf upwards towards the root.
2. In university theory papers, you must clearly draw intermediate rotation steps rather than only the final balanced tree.
3. Inorder traversal of any valid BST always yields elements in ascending sorted order.`,
      summary: `### 30-Second Elevator Pitch
AVL Trees maintain an invariant where the height difference between subtrees never exceeds 1, guaranteeing O(log n) search, insertion, and deletion.

### Core Takeaways
- Balance Factor = Height(Left) - Height(Right), must remain in {-1, 0, 1}.
- 4 Rotation Types: LL (Right), RR (Left), LR (Double), RL (Double).
- Inorder traversal always produces sorted sequence.`,
      language: 'en',
      fileType: 'text',
      user: demoUser._id,
      isShared: true,
      shareScope: 'public',
      viewsCount: 34,
      downloadsCount: 12,
    });

    const note2 = await Note.create({
      title: 'Process Synchronization & Deadlock Conditions',
      subject: 'Operating Systems',
      semester: 'Semester 3',
      tags: ['os', 'concurrency', 'semaphores', 'deadlock'],
      structuredContent: `# Process Synchronization & Deadlock Prevention

## Core Concepts & Overview
When concurrent processes share resources or address spaces without coordinated access, **race conditions** occur where the outcome depends unpredictably on process execution order. Operating systems implement synchronization primitives like mutexes and counting semaphores to protect critical sections.

When processes compete for non-shareable resources, improper coordination can lead to **Deadlock**—a perpetual waiting state where no process can proceed.

## The Critical Section Problem
A valid solution must satisfy three criteria:
1. **Mutual Exclusion**: If process Pi is executing in its critical section, no other processes can execute in their critical sections.
2. **Progress**: If no process is executing in its critical section and some wish to enter, only processes not in remainder sections decide who enters next.
3. **Bounded Waiting**: There exists a limit on the number of times other processes can enter before a requesting process's request is granted.

## Coffman's Four Deadlock Conditions (Exam Crucial!)
All four conditions must hold simultaneously for a deadlock to exist:
- **Mutual Exclusion**: At least one resource is held in a non-shareable mode.
- **Hold and Wait**: A process holds at least one resource while requesting additional resources held by others.
- **No Preemption**: Resources cannot be forcibly taken; they must be released voluntarily by the holding process.
- **Circular Wait**: A closed chain of processes exists where each process waits for a resource held by the next.

## Banker's Algorithm Matrix Equations
$$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$$
Safety check ensures there exists a safe sequence $<P_0, P_1, ..., P_{n-1}>$ where available resources satisfy pending needs.`,
      summary: `### Quick Revision Highlights
- 3 Critical Section Requirements: Mutual Exclusion, Progress, Bounded Waiting.
- 4 Coffman Deadlock Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
- Banker's Algorithm prevents deadlock by checking if resource allocation maintains a valid safe state sequence.`,
      language: 'en',
      fileType: 'text',
      user: demoUser._id,
      isShared: true,
      shareScope: 'public',
      viewsCount: 48,
      downloadsCount: 19,
    });

    console.log('[Seed] Demo study notes created');

    // Create Demo Quiz
    const quiz1 = await Quiz.create({
      title: 'Data Structures: Trees & Balancing Midterm Drill',
      noteId: note1._id,
      subject: 'Data Structures',
      difficulty: 'medium',
      questionType: 'all',
      questions: [
        {
          question: 'What is the maximum allowed balance factor difference in an AVL Tree for any node?',
          type: 'mcq',
          options: [
            'Only 0',
            'Must be between -1, 0, and +1',
            'Up to 2 is acceptable',
            'Any positive integer',
          ],
          correctAnswer: 'Must be between -1, 0, and +1',
          explanation: 'By strict definition, an AVL tree requires the height difference between left and right subtrees to be at most 1.',
          points: 1,
        },
        {
          question: 'True or False: The inorder traversal of any valid Binary Search Tree always produces nodes in ascending sorted order.',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Inorder traversal visits Left, Root, Right recursively, which corresponds strictly to ascending keys in a BST.',
          points: 1,
        },
        {
          question: 'Explain what an LR double rotation entails and when it must be triggered in an AVL tree.',
          type: 'short',
          options: [],
          correctAnswer: 'An LR rotation is performed when an imbalance occurs due to an insertion into the right subtree of a left child. It consists of a left rotation on the child node followed by a right rotation on the unbalanced parent node.',
          explanation: 'Examiners check for: identifying the insertion condition (left-right child) and naming the two sequential single rotations.',
          points: 2,
        },
      ],
      user: demoUser._id,
    });

    // Create Demo Quiz Attempt
    await QuizAttempt.create({
      quiz: quiz1._id,
      user: demoUser._id,
      answers: [
        {
          questionIndex: 0,
          questionText: 'What is the maximum allowed balance factor difference in an AVL Tree for any node?',
          type: 'mcq',
          studentAnswer: 'Must be between -1, 0, and +1',
          correctAnswer: 'Must be between -1, 0, and +1',
          isCorrect: true,
          aiMarks: 1,
          maxMarks: 1,
          feedback: 'Correct! Well done.',
        },
        {
          questionIndex: 1,
          questionText: 'True or False: The inorder traversal of any valid Binary Search Tree always produces nodes in ascending sorted order.',
          type: 'true_false',
          studentAnswer: 'True',
          correctAnswer: 'True',
          isCorrect: true,
          aiMarks: 1,
          maxMarks: 1,
          feedback: 'Correct! Fundamental property of BST.',
        },
        {
          questionIndex: 2,
          questionText: 'Explain what an LR double rotation entails and when it must be triggered in an AVL tree.',
          type: 'short',
          studentAnswer: 'An LR rotation is when you rotate left on the child then rotate right on the unbalanced parent when insertion happens in the right subtree of the left child.',
          correctAnswer: 'An LR rotation consists of a left rotation on the child followed by a right rotation on the parent.',
          isCorrect: true,
          aiMarks: 2,
          maxMarks: 2,
          feedback: 'Excellent written answer! Correctly identified both rotational steps and the triggering imbalance state.',
        },
      ],
      totalScore: 4,
      maxScore: 4,
      percentage: 100,
      feedbackSummary: 'Outstanding mastery! You have an excellent grasp of binary search trees and AVL balancing principles.',
    });

    console.log('[Seed] Demo quiz and attempt created');

    // Create Demo Flashcard Deck
    await FlashcardDeck.create({
      title: 'Data Structures Core Definitions & Complexities',
      subject: 'Data Structures',
      noteId: note1._id,
      cards: [
        {
          front: 'Balance Factor Formula in AVL Trees',
          back: 'BF(Node) = Height(Left Subtree) - Height(Right Subtree). Valid values: -1, 0, +1.',
          category: 'formula',
          mastered: true,
        },
        {
          front: 'Worst-case search time complexity in a standard BST vs AVL Tree',
          back: 'Standard BST: O(n) (degraded to linked list). AVL Tree: O(log n) guaranteed.',
          category: 'concept',
          mastered: true,
        },
        {
          front: 'Inorder Traversal Property of BST',
          back: 'Visiting Left Subtree -> Node -> Right Subtree always yields keys in ascending sorted order.',
          category: 'definition',
          mastered: false,
        },
        {
          front: 'LL vs RR Rotation Trigger',
          back: 'LL: Inserted in Left of Left child -> Single Right Rotate. RR: Inserted in Right of Right child -> Single Left Rotate.',
          category: 'concept',
          mastered: false,
        },
      ],
      user: demoUser._id,
    });

    // Create Demo Study Plan
    const examTarget = new Date();
    examTarget.setDate(examTarget.getDate() + 25);

    await StudyPlan.create({
      user: demoUser._id,
      title: 'Semester 3 Final Examination Roadmap',
      targetExamDate: examTarget,
      subjects: ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks'],
      availableHoursPerDay: 3,
      dailyGoals: [
        {
          text: 'Master AVL rotations and draw 3 test diagrams',
          subject: 'Data Structures',
          date: new Date().toISOString().split('T')[0],
          completed: true,
        },
        {
          text: 'Memorize the 4 Coffman Deadlock Conditions',
          subject: 'Operating Systems',
          date: new Date().toISOString().split('T')[0],
          completed: false,
        },
        {
          text: 'Practice 10 Question Generator MCQs on Binary Trees',
          subject: 'Data Structures',
          date: new Date().toISOString().split('T')[0],
          completed: false,
        },
      ],
      generatedSchedule: [
        {
          dayNumber: 1,
          date: new Date().toISOString().split('T')[0],
          focusSubject: 'Data Structures',
          studyHours: 3,
          topics: ['Unit 2: Binary Search Trees', 'Tree Traversals & AVL Balance Factor', 'Rotations Problem Sets'],
          revisionChecklist: ['Read structured notes', 'Attempt 5 MCQs', 'Review Flashcards'],
        },
        {
          dayNumber: 2,
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          focusSubject: 'Operating Systems',
          studyHours: 3,
          topics: ['Process Synchronization', 'Critical Section Problem & Semaphores', 'Deadlock Coffman Conditions'],
          revisionChecklist: ['Verify Banker Algorithm matrices', 'Explain synchronization aloud'],
        },
      ],
    });

    console.log('[Seed] Demo database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
}

seed();
