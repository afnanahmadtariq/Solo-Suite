import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { InvoiceService } from '../../core/services/invoice.service';
import { ProjectService } from '../../core/services/project.service';
import { ClientService } from '../../core/services/client.service';
import { LeadService } from '../../core/services/lead.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  template: `
    <div class="space-y-4 sm:space-y-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">Dashboard</h2>
        <p class="text-subtle mt-1 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Revenue -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-4 sm:p-6 shadow-lg shadow-orange-500/20">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div class="relative">
            <p class="text-orange-100 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
            <p class="text-2xl sm:text-3xl font-extrabold text-white mt-2">\${{ totalRevenue() | number: '1.0-0' }}</p>
            <p class="text-orange-100/70 text-xs mt-1">All time earnings</p>
          </div>
        </div>

        <!-- Active Projects -->
        <div class="card p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-subtle text-xs font-semibold uppercase tracking-wider">Active Projects</p>
              <p class="text-3xl font-extrabold text-heading mt-2">{{ activeProjects() }}</p>
              <p class="text-faint text-xs mt-1">Currently in progress</p>
            </div>
            <div class="w-11 h-11 bg-sky-500/15 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Amount -->
        <div class="card p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-subtle text-xs font-semibold uppercase tracking-wider">Pending Amount</p>
              <p class="text-3xl font-extrabold text-heading mt-2">\${{ pendingAmount() | number: '1.0-0' }}</p>
              <p class="text-red-400 text-xs mt-1">{{ overdueCount() }} overdue</p>
            </div>
            <div class="w-11 h-11 bg-red-500/15 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Won Leads -->
        <div class="card p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-subtle text-xs font-semibold uppercase tracking-wider">Leads Won</p>
              <p class="text-3xl font-extrabold text-heading mt-2">{{ wonLeadsCount() }}</p>
              <p class="text-emerald-400 text-xs mt-1">\${{ wonLeadsValue() | number: '1.0-0' }} pipeline value</p>
            </div>
            <div class="w-11 h-11 bg-emerald-500/15 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Quick Stats -->
        <div class="card p-6">
          <h3 class="text-sm font-bold text-heading mb-4 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Quick Stats
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-inset rounded-lg border border-theme">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-orange-500/15 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <p class="text-sm text-muted">Active Clients</p>
              </div>
              <p class="text-lg font-bold text-heading">{{ activeClients() }}</p>
            </div>
            <div class="flex items-center justify-between p-4 bg-inset rounded-lg border border-theme">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-sky-500/15 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <p class="text-sm text-muted">Total Invoices</p>
              </div>
              <p class="text-lg font-bold text-heading">{{ totalInvoices() }}</p>
            </div>
            <div class="flex items-center justify-between p-4 bg-inset rounded-lg border border-theme">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-violet-500/15 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <p class="text-sm text-muted">Pipeline Leads</p>
              </div>
              <p class="text-lg font-bold text-heading">{{ totalLeads() }}</p>
            </div>
          </div>
        </div>

        <!-- Revenue Breakdown -->
        <div class="card p-6">
          <h3 class="text-sm font-bold text-heading mb-4 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Revenue Breakdown
          </h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-muted">Paid</span>
                <span class="font-bold text-emerald-500">\${{ totalRevenue() | number: '1.0-0' }}</span>
              </div>
              <div class="w-full bg-inset rounded-full h-2 overflow-hidden border border-theme">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-700" [style.width.%]="revenueBarWidth()"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-muted">Pending</span>
                <span class="font-bold text-amber-500">\${{ pendingOnly() | number: '1.0-0' }}</span>
              </div>
              <div class="w-full bg-inset rounded-full h-2 overflow-hidden border border-theme">
                <div class="bg-amber-500 h-full rounded-full transition-all duration-700" [style.width.%]="pendingBarWidth()"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-muted">Overdue</span>
                <span class="font-bold text-red-500">\${{ overdueAmount() | number: '1.0-0' }}</span>
              </div>
              <div class="w-full bg-inset rounded-full h-2 overflow-hidden border border-theme">
                <div class="bg-red-500 h-full rounded-full transition-all duration-700" [style.width.%]="overdueBarWidth()"></div>
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
  private leadService = inject(LeadService);

  totalRevenue = this.invoiceService.totalRevenue;
  pendingAmount = this.invoiceService.pendingAmount;
  overdueCount = this.invoiceService.overdueCount;
  activeProjects = this.projectService.activeProjectsCount;
  activeClients = this.clientService.activeClientsCount;
  totalInvoices = computed(() => this.invoiceService.invoices().length);
  totalLeads = computed(() => this.leadService.leads().length);
  wonLeadsCount = computed(() => this.leadService.wonLeads().length);
  wonLeadsValue = computed(() => this.leadService.wonLeads().reduce((sum, l) => sum + l.value, 0));

  pendingOnly = computed(() =>
    this.invoiceService.invoices().filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0)
  );
  overdueAmount = computed(() =>
    this.invoiceService.invoices().filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0)
  );
  private totalAmount = computed(() => this.totalRevenue() + this.pendingOnly() + this.overdueAmount() || 1);
  revenueBarWidth = computed(() => (this.totalRevenue() / this.totalAmount()) * 100);
  pendingBarWidth = computed(() => (this.pendingOnly() / this.totalAmount()) * 100);
  overdueBarWidth = computed(() => (this.overdueAmount() / this.totalAmount()) * 100);
}
