from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
applications = {}
next_application_number = 1

# Allowed statuses for an application
ALLOWED_STATUSES = {"Received", "Processing", "Accepted", "Rejected"}

@app.route('/api/applications', methods=['POST'])
def accept_application():
    global next_application_number
    data = request.get_json()
    name = data.get('name')
    zipcode = data.get('zipcode')

    if not name or not zipcode:
        return jsonify({'error': 'Both name and zipcode are required'})

    application = {
        'application_number': next_application_number,
        'name': name,
        'zipcode': zipcode,
        'status': 'Received'
    }
    applications[next_application_number] = application

    response = {
        'message': 'Application received successfully',
        'application_number': next_application_number,
        'status': 'Received'
    }
    next_application_number += 1
    return jsonify(response)

@app.route('/api/applications/<int:app_id>', methods=['GET'])
def check_status(app_id):
    application = applications.get(app_id)
    if application is None:
        return jsonify({'application_number': app_id, 'status': 'Not Found'})

    return jsonify({
        'application_number': app_id,
        'status': application['status']
    })

@app.route('/api/applications/<int:app_id>', methods=['PUT'])
def change_status(app_id):
    application = applications.get(app_id)
    if application is None:
        return jsonify({'error': f'Application number {app_id} Not Found'})

    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ALLOWED_STATUSES:
        return jsonify({
            'error': f"Invalid status. Allowed statuses are: {', '.join(ALLOWED_STATUSES)}"
        }), 400

    application['status'] = new_status
    return jsonify({
        'message': f"Application {app_id} status updated successfully",
        'application_number': app_id,
        'status': new_status
    })

@app.route('/')
def index():
    return render_template('index1.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
