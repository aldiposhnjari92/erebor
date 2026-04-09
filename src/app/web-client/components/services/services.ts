import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-services',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  readonly features = [
    {
      icon: 'grid_view',
      title: 'Connect 500+ apps',
      description:
        'Sync Slack, Microsoft 365, Google Workspace, GitHub, Figma and hundreds more. If your team uses it, SubTrack can track it.',
      color: '#1652f0',
    },
    {
      icon: 'notifications_active',
      title: 'Never miss a renewal',
      description:
        'Get smart alerts days before a charge hits. Review, pause or cancel any subscription directly from the notification.',
      color: '#10b981',
    },
    {
      icon: 'group',
      title: 'Team spending visibility',
      description:
        'See exactly which tools each team member uses. Spot duplicate subscriptions across departments and reclaim wasted budget.',
      color: '#8b5cf6',
    },
    {
      icon: 'cancel',
      title: 'Cancel in one click',
      description:
        'Found a subscription nobody uses? Cancel or reassign it without leaving SubTrack — no more hunting for cancellation pages.',
      color: '#f97316',
    },
  ];

  readonly integrations = [
    { name: 'Slack', color: '#4A154B', abbr: 'S' },
    { name: 'Teams', color: '#5059C9', abbr: 'T' },
    { name: 'Google Workspace', color: '#4285F4', abbr: 'G' },
    { name: 'GitHub', color: '#24292e', abbr: 'GH' },
    { name: 'Figma', color: '#F24E1E', abbr: 'Fi' },
    { name: 'Notion', color: '#000000', abbr: 'N' },
    { name: 'Zoom', color: '#2D8CFF', abbr: 'Z' },
    { name: 'Jira', color: '#0052CC', abbr: 'J' },
    { name: 'Salesforce', color: '#00A1E0', abbr: 'SF' },
    { name: 'Dropbox', color: '#0061FF', abbr: 'D' },
    { name: 'Adobe', color: '#FF0000', abbr: 'A' },
    { name: 'HubSpot', color: '#FF7A59', abbr: 'HS' },
    { name: 'Asana', color: '#F06A6A', abbr: 'As' },
    { name: 'Linear', color: '#5E6AD2', abbr: 'L' },
    { name: 'Loom', color: '#625DF5', abbr: 'Lo' },
    { name: 'Datadog', color: '#632CA6', abbr: 'DD' },
  ];
}
