import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../web-client/components/navbar/navbar';

@Component({
  selector: 'app-about',
  imports: [RouterLink, MatButtonModule, MatIconModule, Navbar],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly stats = [
    { value: '2023', label: 'Founded' },
    { value: '4,200+', label: 'Teams using SubTrack' },
    { value: '$12M+', label: 'Identified in wasted SaaS' },
    { value: '500+', label: 'App integrations' },
  ];

  readonly values = [
    {
      icon: 'visibility',
      title: 'Transparency first',
      description:
        'No hidden fees, no lock-in, no dark patterns. We believe you should always know exactly what you\'re paying for — including us.',
      color: '#1652f0',
    },
    {
      icon: 'auto_awesome',
      title: 'Radical simplicity',
      description:
        'SaaS management doesn\'t have to be complex. We obsess over removing friction so getting visibility takes minutes, not weeks.',
      color: '#10b981',
    },
    {
      icon: 'lock',
      title: 'Privacy by design',
      description:
        'Your subscription data is sensitive. It stays encrypted, it stays yours, and we will never sell it. That\'s not a policy — it\'s a principle.',
      color: '#8b5cf6',
    },
    {
      icon: 'speed',
      title: 'Time is money',
      description:
        'Every minute you spend hunting for subscription details or cancellation pages is wasted. We build fast tools that get out of your way.',
      color: '#f97316',
    },
  ];

  readonly team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-founder',
      bio: 'Previously led engineering at two SaaS startups. Discovered SubTrack\'s need when auditing $800/mo of forgotten subscriptions.',
      avatar: 'AC',
      color: '#1652f0',
    },
    {
      name: 'Sarah Williams',
      role: 'CTO & Co-founder',
      bio: '10 years building developer tools. Passionate about systems that scale without adding complexity for end users.',
      avatar: 'SW',
      color: '#8b5cf6',
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Product',
      bio: 'Former product lead at a fintech company. Believes great products are defined by what they leave out.',
      avatar: 'MJ',
      color: '#10b981',
    },
    {
      name: 'Lisa Park',
      role: 'Head of Design',
      bio: 'Designs systems that make complexity feel simple. Joined SubTrack because the problem was painfully real for her team.',
      avatar: 'LP',
      color: '#f97316',
    },
  ];
}
