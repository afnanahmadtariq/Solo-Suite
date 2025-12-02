import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { InvoiceService } from '../../core/services/invoice.service';
import { ProjectService } from '../../core/services/project.service';
import { ClientService } from '../../core/services/client.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-white">Dashboard</h2>
          <p class="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Stats Cards -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-orange-100 text-sm font-medium">Total Revenue</h3>
              <p class="text-4xl font-bold text-white mt-2">\${{ totalRevenue() | number: '1.0-0' }}</p>
              <span class="text-orange-100 text-sm font-medium mt-1 inline-block">All time earnings</span>
            </div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-gray-400 text-sm font-medium">Active Projects</h3>
              <p class="text-4xl font-bold text-white mt-2">{{ activeProjects() }}</p>
              <span class="text-gray-400 text-sm font-medium mt-1 inline-block">Currently in progress</span>
            </div>
            <div class="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-gray-400 text-sm font-medium">Pending Amount</h3>
              <p class="text-4xl font-bold text-white mt-2">\${{ pendingAmount() | number: '1.0-0' }}</p>
              <span class="text-red-400 text-sm font-medium mt-1 inline-block">{{ overdueCount() }} invoices overdue</span>
            </div>
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Recent Activity
          </h3>
          <div class="space-y-4">
            <div class="flex items-start gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-300">Invoice #1023 paid by <span class="font-medium text-white">Acme Corp</span></p>
                <span class="text-xs text-gray-500">2h ago</span>
              </div>
            </div>
            <div class="flex items-start gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-300">New project started: <span class="font-medium text-white">Website Redesign</span></p>
                <span class="text-xs text-gray-500">5h ago</span>
              </div>
            </div>
            <div class="flex items-start gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <div class="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-300">New lead added: <span class="font-medium text-white">TechStart Inc</span></p>
                <span class="text-xs text-gray-500">1d ago</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Quick Stats
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Active Clients</p>
                  <p class="text-xl font-bold text-white">{{ activeClients() }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Total Invoices</p>
                  <p class="text-xl font-bold text-white">{{ totalInvoices() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private invoiceService = inject(InvoiceService);
  private projectService = inject(ProjectService);
  private clientService = inject(ClientService);

  totalRevenue = this.invoiceService.totalRevenue;
  pendingAmount = this.invoiceService.pendingAmount;
  overdueCount = this.invoiceService.overdueCount;
  activeProjects = this.projectService.activeProjectsCount;
  activeClients = this.clientService.activeClientsCount;
  totalInvoices = computed(() => this.invoiceService.invoices().length);
}
