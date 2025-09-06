import SwiftUI
import FirebaseFirestore

struct MedicationLogView: View {
    let youthId: String
    let youthName: String
    
    @State private var medicationLogs: [MedicationLog] = []
    @State private var isLoading = true
    @State private var showingAddLogSheet = false
    
    var body: some View {
        VStack {
            if isLoading {
                ProgressView("Loading medication logs...")
            } else if medicationLogs.isEmpty {
                VStack(spacing: 20) {
                    Image(systemName: "pills")
                        .font(.system(size: 60))
                        .foregroundColor(.gray)
                    
                    Text("No medication logs found")
                        .font(.headline)
                    
                    Text("Tap the + button to add a new medication log")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .padding()
            } else {
                List {
                    ForEach(medicationLogs) { log in
                        MedicationLogRow(log: log)
                    }
                }
            }
        }
        .navigationTitle("\(youthName)'s Medications")
        .toolbar {
            Button(action: {
                showingAddLogSheet = true
            }) {
                Image(systemName: "plus")
            }
        }
        .onAppear {
            fetchMedicationLogs()
        }
        .sheet(isPresented: $showingAddLogSheet) {
            AddMedicationLogView(youthId: youthId, youthName: youthName, onComplete: {
                fetchMedicationLogs()
            })
        }
    }
    
    private func fetchMedicationLogs() {
        isLoading = true
        
        let db = Firestore.firestore()
        db.collection("medication_logs")
            .whereField("youthId", isEqualTo: youthId)
            .order(by: "timestamp", descending: true)
            .getDocuments { snapshot, error in
                isLoading = false
                
                if let error = error {
                    print("Error fetching medication logs: \(error.localizedDescription)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    return
                }
                
                self.medicationLogs = documents.compactMap { document in
                    let data = document.data()
                    
                    return MedicationLog(
                        id: document.documentID,
                        youthId: data["youthId"] as? String ?? "",
                        medication: data["medication"] as? String ?? "",
                        dosage: data["dosage"] as? String ?? "",
                        notes: data["notes"] as? String,
                        timestamp: (data["timestamp"] as? Timestamp)?.dateValue() ?? Date(),
                        adminBy: data["adminBy"] as? String
                    )
                }
            }
    }
}

struct MedicationLogRow: View {
    let log: MedicationLog
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(log.medication)
                    .font(.headline)
                Spacer()
                Text(formatDate(log.timestamp))
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Text("Dosage: \(log.dosage)")
                .font(.subheadline)
            
            if let notes = log.notes, !notes.isEmpty {
                Text(notes)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 4)
            }
        }
        .padding(.vertical, 8)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

struct AddMedicationLogView: View {
    let youthId: String
    let youthName: String
    let onComplete: () -> Void
    
    @State private var medication = ""
    @State private var dosage = ""
    @State private var notes = ""
    @State private var errorMessage = ""
    @State private var isSubmitting = false
    
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Medication Details")) {
                    TextField("Medication Name", text: $medication)
                    TextField("Dosage", text: $dosage)
                    TextField("Notes (Optional)", text: $notes)
                }
                
                if !errorMessage.isEmpty {
                    Section {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
                
                Section {
                    Button(action: submitLog) {
                        if isSubmitting {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle())
                        } else {
                            Text("Add Medication Log")
                        }
                    }
                    .disabled(medication.isEmpty || dosage.isEmpty || isSubmitting)
                }
            }
            .navigationTitle("Add Medication for \(youthName)")
            .toolbar {
                Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
    }
    
    private func submitLog() {
        isSubmitting = true
        errorMessage = ""
        
        FirestoreService.shared.addMedicationLog(
            youthId: youthId,
            medication: medication,
            dosage: dosage,
            notes: notes.isEmpty ? nil : notes
        ) { error in
            isSubmitting = false
            
            if let error = error {
                errorMessage = "Error: \(error.localizedDescription)"
                return
            }
            
            onComplete()
            presentationMode.wrappedValue.dismiss()
        }
    }
}

struct MedicationLog: Identifiable {
    let id: String
    let youthId: String
    let medication: String
    let dosage: String
    let notes: String?
    let timestamp: Date
    let adminBy: String?
}